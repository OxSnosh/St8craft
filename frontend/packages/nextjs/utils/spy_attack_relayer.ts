import { useAccount, usePublicClient, useWriteContract } from 'wagmi';
import axios from 'axios';
import { recoverMessageAddress, formatEther, encodeFunctionData } from 'viem';
import { useAllContracts } from '~~/utils/scaffold-eth/contractsData';
import * as dotenv from 'dotenv';

dotenv.config();

type Input = {
  signature: string;
  messageHash: string;
  callerNationId: number;
  defenderNationId: number;
  attackType: number;
};

export async function relaySpyOperation(data: Input, contractsData: any) {
  const publicClient = usePublicClient();
  const { address: walletAddress } = useAccount();
  const contracts = useAllContracts();
  const { writeContractAsync } = useWriteContract();
  const { CountryMinter, SpyOperationsContract, NationStrengthContract, TreasuryContract } = contractsData;

  if (!publicClient) {
    throw new Error("publicClient is undefined");
  }

  // Recover address from message and signature using viem
  const recoveredAddress = await recoverMessageAddress({
    message: { raw: `0x${data.messageHash}` as `0x${string}` },
    signature: `0x${data.signature}` as `0x${string}`,
  });

  const mode = process.env.MODE || "localhost";

  // Use publicClient for provider
  let provider = publicClient;

  // Ownership check using CountryMinter contract
  const minter = await publicClient.readContract({
    address: CountryMinter.address,
    abi: CountryMinter.abi,
    functionName: 'checkOwnership',
    args: [data.callerNationId, recoveredAddress],
  });

  if (!minter) {
    throw new Error("Caller is not owner of the nation");
  }

  // Calculate Spy Attack Parameters using SpyOperations contract
  const attackerSuccessScoreRaw = await publicClient.readContract({
    address: SpyOperationsContract.address,
    abi: SpyOperationsContract.abi,
    functionName: 'getAttackerSuccessScore',
    args: [data.callerNationId],
  });
  const attackerSuccessScore = Number(attackerSuccessScoreRaw);

  const defenderSuccessScoreRaw = await publicClient.readContract({
    address: SpyOperationsContract.address,
    abi: SpyOperationsContract.abi,
    functionName: 'getDefenseSuccessScore',
    args: [data.defenderNationId],
  });
  const defenderSuccessScore = Number(defenderSuccessScoreRaw);

  const strengthTotal = attackerSuccessScore + defenderSuccessScore;
  const randomNumber = Math.floor(Math.random() * strengthTotal);

  console.log("Random Number:", randomNumber);

  let success: boolean;
  let attackerId: number;
  const defenderId: number = data.defenderNationId;
  const attackType = data.attackType;

  if (attackType < 1 || attackType > 13) {
    throw new Error("Attack type must be between 1 and 13");
  }

  const defenderStrengthRaw = await publicClient.readContract({
    address: NationStrengthContract.address,
    abi: NationStrengthContract.abi,
    functionName: 'getNationStrength',
    args: [defenderId],
  });
  const defenderStrength = Number(defenderStrengthRaw);

  const cost: number = calculateSpyOperationCost(attackType, defenderStrength);

  const attackerBalanceRaw = await publicClient.readContract({
    address: TreasuryContract.address,
    abi: TreasuryContract.abi,
    functionName: 'checkBalance',
    args: [data.callerNationId],
  });

  const normalizedBalance = formatEther(attackerBalanceRaw as bigint);

  if (parseFloat(normalizedBalance) < cost) {
    throw new Error("Not enough funds to conduct spy operation");
  }

  if (randomNumber < Number(attackerSuccessScore)) {
    console.log("Attack Successful");
    success = true;
    attackerId = 0;
  } else {
    console.log("Spy Attack Thwarted");
    success = false;
    attackerId = data.callerNationId;
  }

  const randomNumberForDamages: number = Math.floor(Math.random() * 9e13) + 1e13;

  // Check if spy operation can be conducted
  const canAttack = await publicClient.readContract({
    address: SpyOperationsContract.address,
    abi: SpyOperationsContract.abi,
    functionName: 'checkSpyOperation',
    args: [defenderId, attackType],
  });

  if (!canAttack) {
    throw new Error("Cannot conduct spy operation of this type at this time");
  }

  const network = await publicClient.getChainId();

  if (network === 31337) {
    // Localhost simulation logic
    try {
      // Simulate the call first without sending transaction
      const spyAttackCalldata = encodeFunctionData({
        abi: SpyOperationsContract.abi,
        functionName: 'spyAttack',
        args: [
          success,
          attackType,
          defenderId,
          attackerId,
          cost,
          randomNumberForDamages,
        ],
      });

      await publicClient.call({
        to: SpyOperationsContract.address,
        data: spyAttackCalldata,
      });
      console.log("Simulation successful ✅, sending transaction...");

      // Then send real transaction
      const tx = await writeContractAsync({
        address: SpyOperationsContract.address,
        abi: SpyOperationsContract.abi,
        functionName: 'spyAttack',
        args: [
          success,
          attackType,
          defenderId,
          attackerId,
          cost,
          randomNumberForDamages,
        ],
      });

      console.log("Transaction sent! Hash:", tx);
    } catch (error: any) {
      console.error("Simulation failed ❌:", error);
      alert(`Spy attack simulation failed: ${error.reason || error.message || "Unknown revert"}`);
      throw new Error("SpyAttack simulation failed");
    }
  } else {
    // Handle Relay (e.g., Gelato relay)
    const calldata = encodeFunctionData({
      abi: SpyOperationsContract.abi,
      functionName: "spyAttack",
      args: [
        success,
        attackType,
        defenderId,
        attackerId,
        cost,
        randomNumberForDamages,
      ],
    });

    const chainId = network;
    const apiKey = process.env.GELATO_RELAY_API_KEY as string;

    const request = {
      chainId,
      target: SpyOperationsContract.address,
      data: calldata,
      user: recoveredAddress,
    };

    const response = await axios.post("https://relay.gelato.digital/tasks/sponsored-call", request, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    console.log("Relay submitted through Gelato:", response.data.taskId);

    return response.data;
  }
}

export function calculateSpyOperationCost(attackType: number, defenderStrength: number): number {
  switch (attackType) {
    case 1:
      return 100000 + defenderStrength;
    case 2:
      return 100000 + defenderStrength * 2;
    case 3:
      return 100000 + defenderStrength * 3;
    case 4:
      return 100000 + defenderStrength * 3;
    case 5:
      return 100000 + defenderStrength * 3;
    case 6:
      return 150000 + defenderStrength;
    case 7:
      return 150000 + defenderStrength * 5;
    case 8:
      return 250000 + defenderStrength * 2;
    case 9:
      return 300000 + defenderStrength * 2;
    case 10:
      return 100000 + defenderStrength * 20;
    case 11:
      return 300000 + defenderStrength * 15;
    case 12:
      return 500000 + defenderStrength * 5;
    case 13:
      return 500000 + defenderStrength * 15;
    default:
      throw new Error("Invalid attack type");
  }
}
