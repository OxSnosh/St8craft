"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
// import { ethers } from "ethers";
// import { AbiCoder } from "ethers/lib/utils";
import { useTheme } from "next-themes";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { setTaxRate } from "~~/utils/infrastructure";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import {
  collectTaxes,
  getDailyIncome,
  getHappiness,
  getTaxRate,
  getTaxablePopulationCount,
  getTaxesCollectible,
} from "~~/utils/taxes";

const CollectTaxes = () => {
  const { theme } = useTheme();
  const { address: walletAddress } = useAccount();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const searchParams = useSearchParams();
  const nationId = searchParams.get("id");
  const TaxesContract = contractsData?.TaxesContract;
  const InfrastructureContract = contractsData?.InfrastructureContract;

  const { writeContractAsync } = useWriteContract();

  const [taxDetails, setTaxDetails] = useState({
    taxesCollectible: "",
    dailyIncome: "",
    happiness: "",
    taxRate: "",
    taxablePopulationCount: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [prevTaxesCollectible, setPrevTaxesCollectible] = useState("");
  const [taxRateInput, setTaxRateInput] = useState(16);

  const fetchTaxDetails = useCallback(async () => {
    if (!nationId || !publicClient || !TaxesContract || !InfrastructureContract) return;

    try {
      const taxesRaw = await getTaxesCollectible(nationId, publicClient, TaxesContract);
      const dailyIncomeRaw = await getDailyIncome(nationId, publicClient, TaxesContract);
      const happinessRaw = await getHappiness(nationId, publicClient, TaxesContract);
      const taxRateRaw = await getTaxRate(nationId, publicClient, InfrastructureContract);
      const taxablePopulationCountRaw = await getTaxablePopulationCount(nationId, publicClient, InfrastructureContract);

      const taxesCollectible = (Number(taxesRaw[1]) / 10 ** 18).toLocaleString();

      setTaxDetails(prevDetails => ({
        ...prevDetails,
        taxesCollectible,
        dailyIncome: Number(dailyIncomeRaw).toLocaleString(),
        happiness: happinessRaw.toString(),
        taxRate: `${taxRateRaw}%`,
        taxablePopulationCount: taxablePopulationCountRaw[0].toString(),
      }));

      setPrevTaxesCollectible(taxesCollectible);
    } catch (error) {
      console.error("Error fetching tax details:", error);
    }
  }, [nationId, publicClient, TaxesContract, InfrastructureContract, prevTaxesCollectible]);

  useEffect(() => {
    fetchTaxDetails();
  }, [fetchTaxDetails]);

  function parseRevertReason(error: any): string {
    if (error?.data) {
      try {
        if (error.data.startsWith("0x08c379a0")) {
          console.log("Revert reason data:", error.data)
        }
      } catch (decodeError) {
        return "Unknown revert reason";
      }
    }
    return error?.message || "Transaction failed";
  }

  const handleCollectTaxes = async () => {
    if (!nationId || !publicClient || !TaxesContract || !writeContractAsync) {
      console.error("Missing required parameters for collectTaxes");
      setErrorMessage("Missing required parameters.");
      return;
    }

    const contractData = contractsData.TaxesContract;

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
        functionName: "collectTaxes",
        args: [nationId],
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
        functionName: "collectTaxes",
        args: [nationId],
      });

      console.log("Transaction Sent:", tx);

      // Refresh state and show success message
      fetchTaxDetails();
      alert("Taxes Collected!");
    } catch (error: any) {
      const errorMessage = parseRevertReason(error);
      console.error("Transaction failed:", errorMessage);
      alert(`Transaction failed: ${errorMessage}`);
    }
  };

  const updateTaxRate = async () => {
    if (!nationId || !InfrastructureContract) {
      console.error("Missing required parameters for updating tax rate");
      return;
    }

    try {
      await setTaxRate(nationId, taxRateInput, InfrastructureContract, writeContractAsync);
      alert("Tax rate updated successfully!");
      fetchTaxDetails();
    } catch (error) {
      console.error("Error updating tax rate:", error);
      alert("Failed to update tax rate");
    }
  };

  return (
    <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
      <h2 className="text-2xl font-bold text-primary-content text-center mb-4">💰 Collect Taxes</h2>
      <p className="text-sm text-center">Manage and collect taxes from your citizens.</p>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-500 text-white rounded-lg text-center shadow-md">{errorMessage}</div>
      )}

      {/* Taxes Table */}
      <table className="w-full mt-4 border-collapse border border-neutral bg-base-200 rounded-lg shadow-md">
        <thead className="bg-primary text-primary-content">
          <tr>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(taxDetails).map(([key, value]) => (
            <tr key={key} className="border-b border-neutral">
              <td className="p-3 capitalize">{key.replace(/([A-Z])/g, " $1")}</td>
              <td className="p-3">{value || "Loading..."}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Collect Taxes Button */}
      <button onClick={handleCollectTaxes} className="btn btn-primary w-full mt-4">
        Collect Now 💰
      </button>

      {/* Update Tax Rate Input */}
      <div className="mt-4 flex flex-col items-center">
        <label className="text-lg font-medium">Set Tax Rate (%):</label>
        <input
          type="number"
          min="16"
          max="30"
          value={taxRateInput}
          onChange={e => setTaxRateInput(Number(e.target.value))}
          className="input input-bordered w-32 mt-2"
        />
        <button onClick={updateTaxRate} className="btn btn-primary mt-2">
          Update Tax Rate
        </button>
      </div>
    </div>
  );
};

export default CollectTaxes;
