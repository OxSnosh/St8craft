"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
// import { ethers } from "ethers";
// import { AbiCoder } from "ethers/lib/utils";
import { useTheme } from "next-themes";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import {
  calculateDailyBillsFromImprovements,
  calculateDailyBillsFromInfrastructure,
  calculateDailyBillsFromMilitary,
  getBillsPayable,
  payBills,
} from "~~/utils/bills";
import { checkOwnership } from "~~/utils/countryMinter";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { getDaysSinceLastBillsPaid } from "~~/utils/treasury";

const PayBills = () => {
  const { theme } = useTheme();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const { address: walletAddress } = useAccount();
  const searchParams = useSearchParams();
  const nationId = searchParams.get("id");
  const BillsContract = contractsData?.BillsContract;
  const CountryMinterContract = contractsData?.CountryMinter;
  const TreasuryContract = contractsData?.TreasuryContract;

  const { writeContractAsync } = useWriteContract();

  const [taxDetails, setTaxDetails] = useState({
    billsPayable: "",
    daysSinceLastBillPayment: "",
    dailyBillsFromInfrastructure: "",
    dailyBillsFromMilitary: "",
    dailyBillsFromImprovements: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    const fetchBillsDetails = async () => {
      if (!nationId || !publicClient || !BillsContract || !TreasuryContract) return;

      try {
        const billsPayable = await getBillsPayable(nationId, publicClient, BillsContract);
        const billsFromInfrastructure = await calculateDailyBillsFromInfrastructure(
          nationId,
          publicClient,
          BillsContract,
        );
        const billsFromMilitary = await calculateDailyBillsFromMilitary(nationId, publicClient, BillsContract);
        const billsFromImprovements = await calculateDailyBillsFromImprovements(nationId, publicClient, BillsContract);
        const daysSinceLastBillPayment = await getDaysSinceLastBillsPaid(nationId, publicClient, TreasuryContract);

        setTaxDetails({
          billsPayable: (Number(billsPayable) / 10 ** 18).toLocaleString(),
          daysSinceLastBillPayment: daysSinceLastBillPayment.toString(),
          dailyBillsFromInfrastructure: (Number(billsFromInfrastructure) / 10 ** 18).toLocaleString(),
          dailyBillsFromMilitary: (Number(billsFromMilitary) / 10 ** 18).toLocaleString(),
          dailyBillsFromImprovements: (Number(billsFromImprovements) / 10 ** 18).toLocaleString(),
        });
      } catch (error) {
        console.error("Error fetching tax details:", error);
      }
    };

    fetchBillsDetails();
  }, [nationId, publicClient, BillsContract, TreasuryContract, refreshTrigger]);

  function parseRevertReason(error: any): string {
    if (error?.data) {
      try {
        if (error.data.startsWith("0x08c379a0")) {
          console.log("Revert reason data:", error.data);
        }
      } catch (decodeError) {
        return "Unknown revert reason";
      }
    }
    return error?.message || "Transaction failed";
  }

  const handlePayBills = async () => {
    if (!nationId || !publicClient || !BillsContract || !writeContractAsync) {
      console.error("Missing required parameters for payBills");
      setErrorMessage("Missing required parameters.");
      return;
    }

    const contractData = contractsData.BillsContract;
    const abi = contractData.abi;

    if (!contractData.address || !abi) {
      console.error("Contract address or ABI is missing");
      return;
    }

    try {
      const publicClient = usePublicClient();
      const { writeContractAsync } = useWriteContract();

      if(!nationId || !publicClient || !BillsContract || !writeContractAsync) {
        console.error("Missing required parameters for payBills");
        setErrorMessage("Missing required parameters.");
        return;
      }

      // Simulate transaction using Wagmi's publicClient
      const data = await publicClient.readContract({
        abi: contractData.abi,
        address: contractData.address,
        functionName: "payBills",
        args: [nationId],
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

      // Fetch old bills payable before executing the transaction
      const oldBillsPayable = await getBillsPayable(nationId, publicClient, BillsContract);

      // Execute the transaction to pay the bills
      await writeContractAsync({
        abi: contractData.abi,
        address: contractData.address,
        functionName: "payBills",
        args: [nationId],
      });

      // Fetch new bills payable after executing the transaction
      const newBillsPayable = await getBillsPayable(nationId, publicClient, BillsContract);

      if (oldBillsPayable.toString() !== newBillsPayable.toString()) {
        setRefreshTrigger(prev => !prev);
      }

      alert("Bills Paid!");
    } catch (error: any) {
      const errorMessage = parseRevertReason(error);
      console.error("Transaction failed:", errorMessage);
      alert(`Transaction failed: ${errorMessage}`);
    }
  };

  return (
    <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
      <h2 className="text-2xl font-bold text-primary-content text-center mb-4">💳 Pay Bills</h2>
      <p className="text-sm text-center">Manage and pay your nations bills.</p>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-500 text-white rounded-lg text-center shadow-md">{errorMessage}</div>
      )}

      {/* Bills Table */}
      <table className="w-full mt-4 border-collapse border border-neutral bg-base-200 rounded-lg shadow-md">
        <thead className="bg-primary text-primary-content">
          <tr>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(taxDetails).map(([key, value]) => (
            <tr key={key} className="border-b border-neutral">
              <td className="p-3 capitalize">{key.replace(/([A-Z])/g, " $1")}</td>
              <td className="p-3">{value !== null ? value : "Loading..."}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pay Bills Button */}
      <button onClick={handlePayBills} className="btn btn-accent w-full mt-4">
        Pay Bills 💳
      </button>
    </div>
  );
};

export default PayBills;
