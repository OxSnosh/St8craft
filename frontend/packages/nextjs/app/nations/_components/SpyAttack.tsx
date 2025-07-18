"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAccount, usePublicClient, useWalletClient, useWriteContract } from "wagmi";
import { tokensOfOwner } from "~~/utils/countryMinter";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { relaySpyAttackERC2771 } from "~~/utils/spy_attack_relayer";

const SpyAttackCard: React.FC = () => {
  const { address: walletAddress } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();        // For ERC2771 relay signing
  const { writeContractAsync } = useWriteContract();       // For direct dev (optional)
  const contractsData = useAllContracts();

  const spyOpsAddress = contractsData?.SpyOperationsContract?.address as `0x${string}` | undefined;
  const [mintedNations, setMintedNations] = useState<{ id: string; name: string }[]>([]);
  const [selectedNation, setSelectedNation] = useState<string | null>(null);
  const [targetNationId, setTargetNationId] = useState<string>("");
  const [attackType, setAttackType] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  // Load player nations
  useEffect(() => {
    (async () => {
      if (!walletAddress || !publicClient || !contractsData?.CountryMinter) return;
      const nations = await tokensOfOwner(walletAddress, publicClient, contractsData.CountryMinter);
      const list = nations.map((id: string) => ({ id, name: `Nation ${id}` }));
      setMintedNations(list);
      if (list.length && !selectedNation) setSelectedNation(list[0].id);
    })();
  }, [walletAddress, publicClient, contractsData, selectedNation]);

  const valid = selectedNation && targetNationId && attackType >= 1 && attackType <= 12;

  const handleSpyAttack = useCallback(async () => {
    if (!valid) {
      alert("Fill all fields correctly.");
      return;
    }
    if (!spyOpsAddress) {
      alert("SpyOperations contract address not loaded yet.");
      return;
    }
    if (!walletClient) {
      alert("Wallet client not ready (connect wallet).");
      return;
    }

    setSubmitting(true);
    try {
      // --- Production: Relay via ERC2771 ---
      const gelatoApiKey = process.env.NEXT_PUBLIC_GELATO_API_KEY; 
      // WARNING: Ideally keep sponsor API key server-side & proxy the request.
      if (!gelatoApiKey) {
        console.warn("No NEXT_PUBLIC_GELATO_API_KEY set – you should proxy from server for security.");
      }

      const result = await relaySpyAttackERC2771({
        attackerId: Number(selectedNation),
        defenderId: Number(targetNationId),
        attackType,
        spyOpsAddress,
        userAddress: walletAddress as `0x${string}`,
        walletClient: walletClient,
        gelatoApiKey: gelatoApiKey || "",
        chainId: publicClient?.chain?.id ?? 1,
      });

      console.log("Relay task submitted:", result);
      alert(`Spy attack queued (taskId: ${result.taskId}). VRF will resolve later.`);

      // Optional: optimistic UI entry
      // addPendingAttack({ ...result, status: 'pending' })

    } catch (e: any) {
      console.error("Spy attack failed:", e);
      alert(`Spy attack failed: ${e?.shortMessage || e?.message || e}`);
    } finally {
      setSubmitting(false);
    }
  }, [valid, spyOpsAddress, walletClient, selectedNation, targetNationId, attackType, walletAddress, publicClient]);

  return (
    <div className="border border-purple-500 p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold text-purple-600 mb-2">Spy Attack</h2>

      {/* Attacking Nation */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Your Nation:</label>
        <select
          value={selectedNation || ""}
          onChange={e => setSelectedNation(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="">Select Nation</option>
            {mintedNations.map(n => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
        </select>
      </div>

      {/* Defender */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Target Nation ID:</label>
        <input
          type="number"
          value={targetNationId}
          onChange={e => setTargetNationId(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Enter target nation ID"
          min={0}
        />
      </div>

      {/* Attack Type */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Attack Type (1–12):</label>
        <select
          value={attackType}
          onChange={e => setAttackType(Number(e.target.value))}
          className="select select-bordered w-full"
        >
          <option value={1}>Destroy Cruise Missiles (1)</option>
          <option value={2}>Destroy Defending Tanks (2)</option>
          <option value={3}>Capture Land (3)</option>
          <option value={4}>Change Desired Government (4)</option>
          <option value={5}>Change Desired Religion (5)</option>
          <option value={6}>Change Threat Level (6)</option>
          <option value={7}>Change DEFCON Level (7)</option>
          <option value={8}>Assassinate Spies (8)</option>
          <option value={9}>Capture Tech (9)</option>
          <option value={10}>Sabotage Taxes (10)</option>
          <option value={11}>Capture Infrastructure (11)</option>
          <option value={12}>Destroy Nukes (12)</option>
        </select>
      </div>

      <button
        onClick={handleSpyAttack}
        className="btn btn-accent w-full"
        disabled={!valid || submitting}
      >
        {submitting ? "Submitting..." : "🚀 Launch Spy Attack"}
      </button>
    </div>
  );
};

export default SpyAttackCard;