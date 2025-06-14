import { ethers } from "ethers";
import { GelatoRelay, SponsoredCallRequest } from "@gelatonetwork/relay-sdk";
import axios from "axios";
import { CountryMinter, NationStrengthContract, SpyOperationsContract } from "../../../../backend/typechain-types";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import * as dotenv from 'dotenv';
import { Abi } from 'abitype';
import { TreasuryContract } from '../../../../backend/typechain-types/contracts/Treasury.sol/TreasuryContract';

dotenv.config()

type Input = {
  signature: string,
  messageHash: string,
  callerNationId: number,
  defenderNationId: number,
  attackType: number
};

export async function relaySpyOperation(data: Input, contractsData: any) {
    const CountryMinter = contractsData?.CountryMinter;
    const NationStrengthContract = contractsData?.NationStrengthContract;
    const SpyOperationsContract = contractsData?.SpyOperationsContract;
    const TreasuryContract = contractsData?.TreasuryContract;
  const recoveredAddress = await ethers.utils.recoverAddress(data.messageHash, data.signature);

  let mode = process.env.MODE || "localhost"; // dynamic mode based on env

  let provider
  if (mode === "localhost") {
    provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
  } else {
    provider = new ethers.providers.JsonRpcProvider("https://sepolia.base.org");
  }
  // --- Ownership check ---
  if (mode === "production") {
    const minter = new ethers.Contract(
      CountryMinter.address,
      CountryMinter.abi,
      provider
    ) as unknown as CountryMinter;
    const owner = await minter.checkOwnership(data.callerNationId, recoveredAddress);
    if (!owner) {
      throw new Error("Caller is not owner of the nation");
    }
  }

  // --- Calculate Spy Attack Parameters ---
  const spyoperations = new ethers.Contract(
    SpyOperationsContract.address,
    SpyOperationsContract.abi as ethers.ContractInterface,
    provider
  ) as unknown as SpyOperationsContract;

  const attackerSuccessScore = await spyoperations.getAttackerSuccessScore(data.callerNationId);
  const defenderSuccessScore = await spyoperations.getDefenseSuccessScore(data.defenderNationId);

  const strengthTotal = attackerSuccessScore.add(defenderSuccessScore).toNumber();
  const randomNumber = Math.floor(Math.random() * strengthTotal);

  console.log("Random Number:", randomNumber);

  let success: boolean;
  let attackerId: number;
  let defenderId: number = data.defenderNationId;
  const attackType = data.attackType;

  if (attackType < 1 || attackType > 13) {
    throw new Error("Attack type must be between 1 and 13");
  }

  const nationStrengthContract = new ethers.Contract(
    NationStrengthContract.address,
    NationStrengthContract.abi as ethers.ContractInterface,
    provider
  ) as unknown as NationStrengthContract;

  const defenderStrengthRaw = await nationStrengthContract.getNationStrength(defenderId);
  const defenderStrength = defenderStrengthRaw.toNumber();

  let cost: number = calculateSpyOperationCost(attackType, defenderStrength);

  const treasury = new ethers.Contract(
    TreasuryContract.address,
    TreasuryContract.abi as ethers.ContractInterface,
    provider
  ) as unknown as TreasuryContract;

  const attackerBalance = await treasury.checkBalance(data.callerNationId);
  const normalizedBalance = ethers.utils.formatEther(attackerBalance);

    if (parseFloat(normalizedBalance) < cost) {
        throw new Error("Not enough funds to conduct spy operation");
    }

  if (randomNumber < attackerSuccessScore.toNumber()) {
    console.log("Attack Successful");
    success = true;
    attackerId = 0;
  } else {
    console.log("Spy Attack Thwarted");
    success = false;
    attackerId = data.callerNationId;
  }

  const randomNumberForDamages: number = Math.floor(Math.random() * 9e13) + 1e13;

  const canAttack = await spyoperations.checkSpyOperation(defenderId, attackType);
  if (!canAttack) {
    throw new Error("Cannot conduct spy operation of this type at this time");
  }

  const network = await provider.getNetwork();

if (Number(network.chainId) === 31337) {
  console.log("Localhost detected (chainId 31337), sending transaction directly...");

  // Connect to the SpyOperations contract with signer0
  const signer0PrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const signer0 = new ethers.Wallet(signer0PrivateKey, provider);

  const spyoperationsWithSigner = new ethers.Contract(
    SpyOperationsContract.address,
    SpyOperationsContract.abi as ethers.ContractInterface,
    signer0
  ) as unknown as SpyOperationsContract;

  try {
    // Simulate the call first without sending transaction
    await spyoperationsWithSigner.callStatic.spyAttack(
      success,
      attackType,
      defenderId,
      attackerId,
      cost,
      randomNumberForDamages
    );
    console.log("Simulation successful ✅, sending transaction...");
  
    // Then send real transaction
    console.log("Sending transaction...");
    console.log("Spy Operations Contract Address:", (spyoperationsWithSigner as unknown as ethers.Contract).address);
    console.log("success:", success);
    console.log("attackType:", attackType);
    console.log("defenderId:", defenderId);
    console.log("attackerId:", attackerId);
    console.log("cost:", cost);
    console.log("randomNumberForDamages:", randomNumberForDamages);
    
    const tx = await spyoperationsWithSigner.spyAttack(
      success,
      attackType,
      defenderId,
      attackerId,
      cost,
      randomNumberForDamages
    );
  
    console.log("Transaction sent! Hash:", tx);
  } catch (error: any) {
    console.error("Simulation failed ❌:", error);
    alert(`Spy attack simulation failed: ${error.reason || error.message || "Unknown revert"}`);
    throw new Error("SpyAttack simulation failed");
  }
} else {
      console.log("Production chain detected, submitting through Gelato Relay...");

      
      // Use ethers.Contract instance to encode function data
      const spyoperationsEthers = new ethers.Contract(
        SpyOperationsContract.address,
        SpyOperationsContract.abi as ethers.ContractInterface,
        provider
      );

      const calldata = spyoperationsEthers.interface.encodeFunctionData("spyAttack", [
        success,
        attackType,
        defenderId,
        attackerId,
        cost,
        randomNumberForDamages,
      ]);

      console.log("Spy Attack Calldata:", calldata);
      console.log("Spy Attack Cost:", cost);
      console.log("Spy Attack Success:", success);
      console.log("Spy Attack Type:", attackType);
      console.log("Spy Attack Defender ID:", defenderId);
      console.log("Spy Attack Attacker ID:", attackerId);
      console.log("Spy Attack Random Number:", randomNumberForDamages);

      const chainId = network.chainId;
      const apiKey = process.env.GELATO_RELAY_API_KEY as string;

     const request = {
        chainId,
        target: SpyOperationsContract.address,
         data: calldata,
        user: recoveredAddress,
      };

      const response = await axios.post(
        "https://relay.gelato.digital/tasks/sponsored-call",
        request,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
        }
      );

      console.log("Relay submitted through Gelato:", response.data.taskId);

      return response.data;
    }
}
export function calculateSpyOperationCost(attackType: number, defenderStrength: number): number {
    switch (attackType) {
      case 1:
        return 100000 + (defenderStrength);
      case 2:
        return 100000 + (defenderStrength * 2);
      case 3:
        return 100000 + (defenderStrength * 3);
      case 4:
        return 100000 + (defenderStrength * 3);
      case 5:
        return 100000 + (defenderStrength * 3);
      case 6:
        return 150000 + (defenderStrength);
      case 7:
        return 150000 + (defenderStrength * 5);
      case 8:
        return 250000 + (defenderStrength * 2);
      case 9:
        return 300000 + (defenderStrength * 2);
      case 10:
        return 100000 + (defenderStrength * 20);
      case 11:
        return 300000 + (defenderStrength * 15);
      case 12:
        return 500000 + (defenderStrength * 5);
      case 13:
        return 500000 + (defenderStrength * 15);
      default:
        throw new Error("Invalid attack type");
    }
  }
