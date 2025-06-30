"use client"

import React, { useEffect, useState } from "react";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
// import { ethers } from "ethers";
// import { AbiCoder } from "ethers/lib/utils";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import {
  acceptProposal,
  cancelAid,
  checkAidSlots,
  getProposalsReceived,
  getProposalsSent,
  proposeAid,
} from "~~/utils/aid";
import { tokensOfOwner } from "~~/utils/countryMinter";
import { getDefendingSoldierCount } from "~~/utils/forces";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { getTechnologyCount } from "~~/utils/technology";
import { checkBalance } from "~~/utils/treasury";

const WEI_IN_ETH = BigInt("1000000000000000000");

const ManageAid = () => {
  const publicClient = usePublicClient();
  const { address: walletAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const contractsData = useAllContracts();

  const CountryMinter = contractsData?.CountryMinter;
  const InfrastructureContract = contractsData?.InfrastructureContract;
  const TreasuryContract = contractsData?.TreasuryContract;
  const ForcesContract = contractsData?.ForcesContract;
  const AidContract = contractsData?.AidContract;

  const [mintedNations, setMintedNations] = useState<{ id: string | number; name: string }[]>([]);
  const [selectedNationId, setSelectedNationId] = useState(null);
  const [aidBalances, setAidBalances] = useState<{
    defendingSoldierCount: number;
    nationBalance: bigint;
    technologyCount: number;
  } | null>(null);
  const [available, setAidSlots] = useState<number | null>(null);
  const [aidPartnerId, setAidPartnerId] = useState("");
  const [aidPartnerSlots, setAidPartnerSlots] = useState<number | null>(null);
  const [techAid, setTechAid] = useState(0);
  const [balanceAid, setBalanceAid] = useState(0);
  const [soldierAid, setSoldierAid] = useState(0);
  const [proposedAidSent, setProposedAidSent] = useState<(string | number | bigint)[]>([]);
  const [proposedAidReceived, setProposedAidReceived] = useState<(string | number | bigint)[]>([]);

  useEffect(() => {
    const fetchMintedNations = async () => {
      if (walletAddress && CountryMinter && publicClient) {
        const ownedNations = await tokensOfOwner(walletAddress, publicClient, CountryMinter);
        setMintedNations(ownedNations.map((id: string | number) => ({ id, name: `Nation ${id}` })));
      }
    };
    fetchMintedNations();
  }, [walletAddress, CountryMinter, publicClient]);

  const handleNationChange = async (nationId: any) => {
    setSelectedNationId(nationId);
    const defendingSoldierCount = await getDefendingSoldierCount(nationId, publicClient, ForcesContract);
    const nationBalance = await checkBalance(nationId, publicClient, TreasuryContract);
    const technologyCount = await getTechnologyCount(nationId, publicClient, InfrastructureContract);
    const available = await checkAidSlots(nationId, AidContract, publicClient);

    setAidSlots(available);
    setAidBalances({ defendingSoldierCount, nationBalance, technologyCount });

    const sentProposals = await getProposalsSent(nationId, AidContract, publicClient);
    const receivedProposals = await getProposalsReceived(nationId, AidContract, publicClient);
    setProposedAidSent(sentProposals);
    setProposedAidReceived(receivedProposals);
  };

  const handlePartnerChange = async (partnerId: string) => {
    setAidPartnerId(partnerId);
    const availableSlots = await checkAidSlots(partnerId, AidContract, publicClient);
    setAidPartnerSlots(availableSlots);
  };

  function parseRevertReason(error: any): string {
    if (error?.data) {
      try {
        if (error.data.startsWith("0x08c379a0")) {
          console.log("Parsing revert reason from data:", error.data);
        }
      } catch (decodeError) {
        return "Unknown revert reason";
      }
    }
    return error?.message || "Transaction failed";
  }

  const handleProposeAid = async () => {
    if (!selectedNationId || !aidPartnerId) return;

    const contractData = contractsData.AidContract;
    const abi = contractData.abi;

    if (!contractData.address || !abi) {
      console.error("Contract address or ABI is missing");
      return;
    }

    const adjustedBalanceAid = BigInt(balanceAid) * WEI_IN_ETH;

    try {
      const publicClient = usePublicClient();
      const { writeContractAsync } = useWriteContract();

      if (!publicClient || !writeContractAsync) {
        console.error("Public client or write contract function is not available");
        return;
      }
      // Simulate the transaction using Wagmi's public client
      const data = await publicClient.readContract({
        abi: contractData.abi,
        address: contractData.address,
        functionName: "proposeAid",
        args: [
          selectedNationId,
          aidPartnerId,
          techAid,
          adjustedBalanceAid,
          soldierAid
        ]
      });

      // Simulate the transaction
      try {
        const result = await publicClient.call({
          to: contractData.address,
          data: data as `0x${string}`,
        });

        console.log("Transaction Simulation Result:", result);

        if (String(result).startsWith("0x08c379a0")) {
          const errorMessage = parseRevertReason({ data: result });
          alert(`Transaction failed: ${errorMessage}`);
          return;
        }
      } catch (simulationError: any) {
        const errorMessage = parseRevertReason(simulationError);
        console.error("Transaction simulation failed:", errorMessage);
        alert(`Transaction failed: ${errorMessage}`);
        return;
      }

      // Execute the transaction if simulation is successful
      await writeContractAsync({
        abi: contractData.abi,
        address: contractData.address,
        functionName: "proposeAid",
        args: [
          selectedNationId,
          aidPartnerId,
          techAid,
          adjustedBalanceAid,
          soldierAid
        ]
      });

      handleNationChange(selectedNationId);
      alert("Aid proposal sent successfully!");

    } catch (error: any) {
      const errorMessage = parseRevertReason(error);
      console.error("Transaction failed:", errorMessage);
      alert(`Transaction failed: ${errorMessage}`);
    }
  };


const handleAcceptAid = async (proposalId: string) => {
    if (!selectedNationId) return;

    const contractData = contractsData.AidContract;
    const abi = contractData.abi;

    if (!contractData.address || !abi) {
      console.error("Contract address or ABI is missing");
      return;
    }

    try {
      const publicClient = usePublicClient();
      const { writeContractAsync } = useWriteContract();

      if (!publicClient || !writeContractAsync) {
        console.error("Public client or write contract function is not available");
        return;
      }

      // Simulate the transaction using Wagmi's public client
      const data = await publicClient.readContract({
        abi: contractData.abi,
        address: contractData.address,
        functionName: "acceptProposal",
        args: [proposalId],
      });

      // Simulate the transaction
      try {
        const result = await publicClient.call({
          to: contractData.address,
          data: data as `0x${string}`,
        });

        console.log("Transaction Simulation Result:", result);

        if (String(result).startsWith("0x08c379a0")) {
          const errorMessage = parseRevertReason({ data: result });
          alert(`Transaction failed: ${errorMessage}`);
          return;
        }
      } catch (simulationError: any) {
        const errorMessage = parseRevertReason(simulationError);
        console.error("Transaction simulation failed:", errorMessage);
        alert(`Transaction failed: ${errorMessage}`);
        return;
      }

      // Execute the transaction if simulation is successful
      await writeContractAsync({
        abi: contractData.abi,
        address: contractData.address,
        functionName: "acceptProposal",
        args: [proposalId],
      });

    handleNationChange(selectedNationId);
      alert("Aid proposal accepted successfully!");
    } catch (error: any) {
      const errorMessage = parseRevertReason(error);
      console.error("Transaction failed:", errorMessage);
      alert(`Transaction failed: ${errorMessage}`);
    }
  };

  const handleCancelAid = async (proposalId: string) => {
    if (!selectedNationId || !aidPartnerId) return;

    const contractData = contractsData.AidContract;
    const abi = contractData.abi;

    if (!contractData.address || !abi) {
      console.error("Contract address or ABI is missing");
      return;
    }

    try {
      const publicClient = usePublicClient();
      const { writeContractAsync } = useWriteContract();

      if (!publicClient || !writeContractAsync) {
        console.error("Public client or write contract function is not available");
        return;
      }

      // Simulate the transaction using Wagmi's public client
      const data = await publicClient.readContract({
        abi: contractData.abi,
        address: contractData.address,
        functionName: "cancelAid",
        args: [proposalId],
      });

      // Simulate the transaction
      try {
        const result = await publicClient.call({
          to: contractData.address,
          data: data as `0x${string}`,
        });

        console.log("Transaction Simulation Result:", result);

        if (String(result).startsWith("0x08c379a0")) {
          const errorMessage = parseRevertReason({ data: result });
          alert(`Transaction failed: ${errorMessage}`);
          return;
        }
      } catch (simulationError: any) {
        const errorMessage = parseRevertReason(simulationError);
        console.error("Transaction simulation failed:", errorMessage);
        alert(`Transaction failed: ${errorMessage}`);
        return;
      }

      // Execute the transaction if simulation is successful
      await writeContractAsync({
        abi: contractData.abi,
        address: contractData.address,
        functionName: "cancelAid",
        args: [proposalId],
      });

      handleNationChange(selectedNationId);
      alert("Aid proposal canceled successfully!");
    } catch (error: any) {
      const errorMessage = parseRevertReason(error);
      console.error("Transaction failed:", errorMessage);
      alert(`Transaction failed: ${errorMessage}`);
    }
  };

  return (
    <div className="font-special p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
      <h2 className="text-2xl font-bold text-primary-content text-center mb-4">Aid Management</h2>

      {/* Sending Nation Table */}
      <table className="w-full border border-neutral bg-base-200 rounded-lg shadow-md">
        <thead className="bg-primary text-primary-content">
          <tr>
            <th className="p-3 text-left">Sending Nation</th>
            <th className="p-3 text-left">Aid Slots</th>
            <th className="p-3 text-left">Defending Soldiers</th>
            <th className="p-3 text-left">Nation Balance</th>
            <th className="p-3 text-left">Technology Count</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-neutral">
            <td className="p-3">
              <select
                onChange={e => handleNationChange(e.target.value)}
                value={selectedNationId || ""}
                className="select select-bordered w-full bg-base-100 text-base-content"
              >
                <option value="">Select a Nation</option>
                {mintedNations.map(nation => (
                  <option key={nation.id} value={nation.id}>
                    {nation.name}
                  </option>
                ))}
              </select>
            </td>
            <td className="p-3">{available !== null ? available.toString() : "-"}</td>
            <td className="p-3">{aidBalances ? aidBalances.defendingSoldierCount.toString() : "-"}</td>
            <td className="p-3">{aidBalances ? (aidBalances.nationBalance / WEI_IN_ETH).toString() : "-"}</td>
            <td className="p-3">{aidBalances ? aidBalances.technologyCount.toString() : "-"}</td>
          </tr>
        </tbody>
      </table>

      {/* Aid Proposal Form */}
      <h3 className="text-xl font-semibold text-primary mt-6 mb-2">Send Aid</h3>
      <table className="w-full border border-neutral bg-base-200 rounded-lg shadow-md">
        <thead className="bg-primary text-primary-content">
          <tr>
            <th className="p-3 text-left">Recipient Nation ID</th>
            <th className="p-3 text-left">Soldiers to Send</th>
            <th className="p-3 text-left">Balance to Send</th>
            <th className="p-3 text-left">Tech to Send</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-neutral">
            <td className="p-3">
              <input
                type="text"
                placeholder="Recipient Nation ID"
                value={aidPartnerId}
                onChange={e => handlePartnerChange(e.target.value)}
                className="input input-bordered w-full bg-base-100 text-base-content"
              />
            </td>
            <td className="p-3">
              <input
                type="number"
                placeholder="Soldiers to Send"
                value={soldierAid}
                onChange={e => setSoldierAid(Number(e.target.value))}
                className="input input-bordered w-full bg-base-100 text-base-content"
              />
            </td>
            <td className="p-3">
              <input
                type="number"
                placeholder="Balance to Send"
                value={balanceAid}
                onChange={e => setBalanceAid(Number(e.target.value))}
                className="input input-bordered w-full bg-base-100 text-base-content"
              />
            </td>
            <td className="p-3">
              <input
                type="number"
                placeholder="Tech to Send"
                value={techAid}
                onChange={e => setTechAid(Number(e.target.value))}
                className="input input-bordered w-full bg-base-100 text-base-content"
              />
            </td>
          </tr>
          <tr>
            <td colSpan={5} className="p-3 text-center">
              <button onClick={handleProposeAid} className="btn btn-accent w-full">
                Propose Aid
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Aid Proposals Sent */}
      <h3 className="text-xl font-semibold text-primary mt-6 mb-2">Proposals Sent</h3>
      <table className="w-full border border-neutral bg-base-200 rounded-lg shadow-md">
        <tbody>
          {proposedAidSent.length > 0 ? (
            proposedAidSent.map((proposalId, index) => (
              <tr key={index} className="border-b border-neutral">
                <td className="p-3">Proposal ID: {proposalId.toString()}</td>
                <td>
                  <button onClick={() => handleCancelAid(proposalId.toString())} className="btn btn-error">
                    Cancel
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-3 text-center text-sm text-secondary-content">No aid proposals sent.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Aid Proposals Received */}
      <h3 className="text-xl font-semibold text-primary mt-6 mb-2">Proposals Received</h3>
      <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md">
        <tbody>
          {proposedAidReceived.length > 0 ? (
            proposedAidReceived.map((proposalId, index) => (
              <tr key={index} className="border-b border-neutral">
                <td className="p-3">Proposal ID: {proposalId.toString()}</td>
                <td>
                  <button onClick={() => handleAcceptAid(proposalId.toString())} className="btn btn-success">
                    Accept
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-3 text-center text-sm text-secondary-content">No aid proposals received.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAid;
