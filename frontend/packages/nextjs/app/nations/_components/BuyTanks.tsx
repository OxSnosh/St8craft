"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { parseRevertReason } from "../../../utils/errorHandling";
// import { ethers } from "ethers";
import { useTheme } from "next-themes";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { checkOwnership } from "~~/utils/countryMinter";
import { buyTanks, decommissionTanks, getMaxTankCount, getTankCost, getTankCount } from "~~/utils/forces";
import { getTotalPopulationCount } from "~~/utils/infrastructure";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { checkBalance } from "~~/utils/treasury";

const BuyTanks = () => {
  const { theme } = useTheme();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const { address: walletAddress } = useAccount();
  const searchParams = useSearchParams();
  const nationId = searchParams.get("id");
  const ForcesContract = contractsData?.ForcesContract;
  const InfrastructureContract = contractsData?.InfrastructureContract;
  const CountryMinterContract = contractsData?.CountryMinter;
  const TreasuryContract = contractsData?.TreasuryContract;

  const { writeContractAsync } = useWriteContract();

  const [tankDetails, setTankDetails] = useState({
    warBucksBalance: "",
    tanks: "",
    costPerTank: "",
    maxTankCount: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [cost, setCost] = useState<string | null>(null);
  const [amountInput, setAmountInput] = useState<string>("");
  const [amountToDecrease, setAmountToDecrease] = useState<string>("");

  useEffect(() => {
    const fetchBuyTankDetails = async () => {
      if (!nationId || !publicClient || !InfrastructureContract) return;

      try {
        const warBuckBalance = await checkBalance(nationId, publicClient, TreasuryContract);
        const tankAmount = await getTankCount(nationId, publicClient, ForcesContract);
        const tankCost = await getTankCost(nationId, publicClient, ForcesContract);
        const maxTankCount = await getMaxTankCount(nationId, publicClient, ForcesContract);

        setTankDetails({
          warBucksBalance: (warBuckBalance / BigInt(10 ** 18)).toLocaleString(),
          tanks: tankAmount.toString(),
          costPerTank: tankCost.toLocaleString(),
          maxTankCount: maxTankCount.toString(),
        });
      } catch (error) {
        console.error("Error fetching infrastructure details:", error);
      }
    };

    fetchBuyTankDetails();
  }, [nationId, publicClient, InfrastructureContract, TreasuryContract, refreshTrigger]);

  const handleCalculateCost = async (amount: any) => {
    if (!amount || !nationId || !publicClient || !ForcesContract) {
      setErrorMessage("Please enter a valid level.");
      return;
    }

    try {
      const costPerTank = BigInt(tankDetails.costPerTank.replace(/,/g, ""));
      const cost = (BigInt(amount) * costPerTank).toString();

      setCost(BigInt(costPerTank).toString());

      setErrorMessage("");
    } catch (error) {
      console.error("Error calculating cost per level:", error);
      setErrorMessage("Failed to calculate cost. Please try again.");
    }
  };

  // const handleBuyTanks = async (amount : any) => {

  //     if (!nationId || !publicClient || !ForcesContract || !walletAddress || !cost) {
  //         setErrorMessage("Missing required information to proceed with the purchase.");
  //         return;
  //     }

  //     try {
  //         await buyTanks(nationId, Number(amount), publicClient, ForcesContract, writeContractAsync);
  //         setRefreshTrigger(!refreshTrigger);
  //         setErrorMessage("");
  //         alert("Tanks purchased successfully!");
  //     } catch (error) {
  //         console.error("Error buying land:", error);
  //         setErrorMessage("Failed to complete the purchase. Please try again.");
  //     }
  // };

  const handleBuyTanks = async (amount: any) => {
    if (!nationId || !publicClient || !ForcesContract || !walletAddress || !cost) {
      setErrorMessage("Missing required information to proceed with the purchase.");
      return;
    }

    const contractData = contractsData.ForcesContract;

    // Ensure contract data and ABI are available
    if (!contractData.address || !contractData.abi) {
      console.error("Contract address or ABI is missing");
      return;
    }

    try {
      // Simulate the transaction (readContract) using Wagmi's publicClient
      const data = await publicClient.readContract({
        abi: contractData.abi,
        address: contractData.address,
        functionName: "buyTanks",
        args: [Number(amount), nationId],
      });

      // Simulate the transaction call
      const result = await publicClient.call({
        to: contractData.address,
        data: data as `0x${string}`,
      });

      console.log("Transaction Simulation Result:", result);

      // Check for revert reason in the result
      if (String(result).startsWith("0x08c379a0")) {
        const errorMessage = parseRevertReason({ data: result });
        alert(`Transaction failed: ${errorMessage}`);
        return;
      }

      // Send the transaction using Wagmi's writeContractAsync
      const tx = await writeContractAsync({
        address: contractData.address,
        abi: contractData.abi,
        functionName: "buyTanks",
        args: [Number(amount), nationId],
      });

      console.log("Transaction Sent:", tx);

      // Refresh state and show success message
      setRefreshTrigger(!refreshTrigger);
      setErrorMessage("");
      alert("Tanks purchased successfully!");
    } catch (error: any) {
      const errorMessage = parseRevertReason(error);
      console.error("Transaction failed:", errorMessage);
      alert(`Transaction failed: ${errorMessage}`);
    }
  };

  const handleDecommissionTanks = async (amount: any) => {
    if (!nationId || !publicClient || !ForcesContract || !walletAddress) {
      setErrorMessage("Missing required information to proceed with the decommission.");
      return;
    }

    try {
      await decommissionTanks(nationId, Number(amount), publicClient, ForcesContract, writeContractAsync);
      setRefreshTrigger(!refreshTrigger);
      setErrorMessage("");
      alert("Tanks decommissioned successfully!");
    } catch (error) {
      console.error("Error decommissioning tanks:", error);
      setErrorMessage("Failed to decommission tanks. Please try again.");
    }
  };

  return (
    <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
      <h2 className="text-2xl font-bold text-primary-content text-center mb-4">🛡️ Buy Tanks</h2>

      {/* Error Message Handling */}
      {errorMessage && <div className="mt-4 p-4 bg-red-500 text-white rounded-lg shadow-md">{errorMessage}</div>}

      {/* Tanks Table */}
      <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
        <thead className="bg-primary text-primary-content">
          <tr>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(tankDetails).map(([key, value]) => (
            <tr key={key} className="border-b border-neutral">
              <td className="p-3 capitalize">{key.replace(/([A-Z])/g, " $1")}</td>
              <td className="p-3">{value !== null ? value : "Loading..."}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tank Purchase Form */}
      <div className="bg-base-200 p-4 rounded-lg shadow-md">
        <label className="text-lg font-semibold text-primary block mb-2">Enter Amount:</label>
        <input
          type="number"
          value={amountInput}
          onChange={e => setAmountInput(e.target.value)}
          className="input input-bordered w-full bg-base-100 text-base-content mb-4"
          placeholder="Enter amount to buy"
        />
        <button onClick={() => handleCalculateCost(amountInput)} className="btn btn-accent w-full">
          Calculate Tank Purchase Cost
        </button>

        {cost !== null && (
          <div className="mt-4 text-center text-lg font-semibold bg-blue-500 text-white p-3 rounded-lg shadow-md">
            Cost per Tank: {cost}
          </div>
        )}

        {cost !== null && (
          <button onClick={() => handleBuyTanks(amountInput)} className="btn btn-primary w-full mt-4">
            Buy {amountInput} Tanks for {Number(amountInput) * Number(cost)} War Bucks
          </button>
        )}
      </div>

      {/* Tank Decommission Form */}
      <div className="bg-base-200 p-4 rounded-lg shadow-md mt-6">
        <label className="text-lg font-semibold text-primary block mb-2">Enter Amount:</label>
        <input
          type="number"
          value={amountToDecrease} // ✅ Correct state variable
          onChange={e => setAmountToDecrease(e.target.value)}
          className="input input-bordered w-full bg-base-100 text-base-content mb-4"
          placeholder="Enter amount to decommission"
        />
        <button onClick={() => handleDecommissionTanks(amountToDecrease)} className="btn btn-accent w-full">
          Decommission Tanks
        </button>
      </div>
    </div>
  );
};

export default BuyTanks;
