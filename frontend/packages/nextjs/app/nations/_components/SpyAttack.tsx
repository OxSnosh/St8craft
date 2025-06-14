import React, { useState, useEffect } from "react";
import { usePublicClient, useAccount, useWriteContract } from 'wagmi';
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { relaySpyOperation } from "~~/utils/spy_attack_relayer"; // <- You need to make sure you have a spyAttacks.ts helper calling your relaySpyOperation function properly.
import { CountryMinter } from '../../../../../../backend/typechain-types/contracts/CountryMinter';
import { tokensOfOwner } from "~~/utils/countryMinter";

const SpyAttackCard = () => {
    const { address: walletAddress } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();
    const contractsData = useAllContracts();
    const CountryMinter = contractsData?.CountryMinter as unknown as CountryMinter;

    const [mintedNations, setMintedNations] = useState<{ id: string; name: string }[]>([]);
    const [selectedNation, setSelectedNation] = useState<string | null>(null);
    const [targetNationId, setTargetNationId] = useState<string>("");
    const [attackType, setAttackType] = useState<number>(1);

     useEffect(() => {
            const fetchMintedNations = async () => {
                if (!walletAddress || !contractsData?.CountryMinter) return;
                const nations = await tokensOfOwner(walletAddress, publicClient, contractsData.CountryMinter);
                setMintedNations(nations.map((id: string) => ({ id, name: `Nation ${id}` })));
                if (nations.length > 0) setSelectedNation(nations[0].id);
            };
    
            fetchMintedNations();
        }, [walletAddress, contractsData, publicClient]);

    const handleSpyAttack = async () => {
        console.log("handleSpyAttack", selectedNation, targetNationId, attackType);
    
        if (typeof window === "undefined" || !window.ethereum || !window.ethereum.isMetaMask) {
            alert("Metamask is not installed or not detected. Please install Metamask.");
            return;
        }
    
        if (!selectedNation || !targetNationId || attackType < 1 || attackType > 13) {
            alert("Please fill in all fields correctly.");
            return;
        }
    
        try {
            const provider = new Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
    
            const message = "Spy Operation Authorization";
            const signature = await signer.signMessage(message);
            const messageHash = ethers.utils.hashMessage(message);
    
            const payload = {
                signature,
                messageHash,
                callerNationId: Number(selectedNation),
                defenderNationId: Number(targetNationId),
                attackType,
            };
    
            console.log("Spy Attack Payload:", payload);
    
            await relaySpyOperation(payload, contractsData);
    
            alert(`Spy Attack launched from Nation ${selectedNation} to Nation ${targetNationId} using attack type ${attackType}!`);
        } catch (error: any) {
            console.error("Spy attack failed:", error);
            alert(`Spy attack failed: ${error.message || "Unknown error"}`);
        }
    };

    return (
        <div className="border border-purple-500 p-4 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-bold text-purple-600 mb-2">Spy Attack</h2>

            {/* Select Attacking Nation */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Select Your Nation:</label>
                <select
                    value={selectedNation || ""}
                    onChange={(e) => setSelectedNation(e.target.value)}
                    className="select select-bordered w-full"
                >
                    <option value="">Select Nation</option>
                    {mintedNations.map((nation) => (
                        <option key={nation.id} value={nation.id}>
                            {nation.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Enter Target Nation ID */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Target Nation ID:</label>
                <input
                    type="number"
                    value={targetNationId}
                    onChange={(e) => setTargetNationId(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="Enter target nation ID"
                />
            </div>

            {/* Choose Attack Type */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Select Attack Type:</label>
                <select
                    value={attackType}
                    onChange={(e) => setAttackType(Number(e.target.value))}
                    className="select select-bordered w-full"
                >
                    <option value="">Select Attack Type</option>
                    <option value="1">Destroy Cruise Missiles (1)</option>
                    <option value="2">Destroy Defending Tanks (2)</option>
                    <option value="3">Capture Land (3)</option>
                    <option value="4">Change Desired Government (4)</option>
                    <option value="5">Change Desired Religion (5)</option>
                    <option value="6">Change Threat Level (6)</option>
                    <option value="7">Change DEFCON Level (7)</option>
                    <option value="8">Assassinate Spies (8)</option>
                    <option value="9">Capture Tech (9)</option>
                    <option value="10">Sabotage Taxes (10)</option>
                    <option value="11">Destroy Money Reserves (11)</option>
                    <option value="12">Capture Infrastructure (12)</option>
                    <option value="13">Destroy Nukes (13)</option>
                </select>
                </div>

            {/* Attack Button */}
            <button
                onClick={handleSpyAttack}
                className="btn btn-accent w-full"
                disabled={!selectedNation || !targetNationId || !(attackType >= 1 && attackType <= 13)}
            >
                🚀 Launch Spy Attack
            </button>
        </div>
    );
};

export default SpyAttackCard;