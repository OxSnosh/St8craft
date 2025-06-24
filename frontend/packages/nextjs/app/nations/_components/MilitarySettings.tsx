"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { parseRevertReason } from "../../../utils/errorHandling";
// import { ethers } from "ethers";
import { useTheme } from "next-themes";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { checkOwnership } from "~~/utils/countryMinter";
import {
  getWarPeacePreference,
  toggleWarPeacePreference,
  updateDefconLevel,
  updateThreatLevel,
} from "~~/utils/military";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { checkBalance } from "~~/utils/treasury";

const MilitarySettings = () => {
  const { theme } = useTheme();
  const { address: walletAddress } = useAccount();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const searchParams = useSearchParams();
  const CountryMinterContract = contractsData?.CountryMinter;
  const MilitaryContract = contractsData?.MilitaryContract;

  const { writeContractAsync } = useWriteContract();
  const nationId = searchParams.get("id");

  const [formData, setFormData] = useState({
    DEFCON: "",
    ThreatLevel: "",
  });
  const [warPeaceStatus, setWarPeaceStatus] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let status: any;

  useEffect(() => {
    const fetchWarPeaceStatus = async () => {
      console.log(nationId, MilitaryContract);
      if (nationId && MilitaryContract) {
        try {
          status = await getWarPeacePreference(nationId, publicClient, MilitaryContract);
          console.log("W/P STATUS", status);
          setWarPeaceStatus(status[0]);
        } catch (error) {
          console.error("Failed to fetch war/peace status", error);
        }
      }
    };
    fetchWarPeaceStatus();
  }, [nationId, MilitaryContract]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (field: keyof typeof formData, value: string) => {
    console.log("Submitting form for:", field, value);
    console.log("Current nation ID:", nationId);
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!nationId) {
      setErrorMessage("Nation ID not found.");
      setLoading(false);
      return;
    }

    if (!walletAddress) {
      setErrorMessage("Wallet not connected.");
      setLoading(false);
      return;
    }

    if (!MilitaryContract || !publicClient || !writeContractAsync) {
      setErrorMessage("Missing required dependencies to update military settings.");
      setLoading(false);
      return;
    }

    if (!value.trim()) {
      setErrorMessage(`${field.replace(/([A-Z])/g, " $1")} cannot be empty.`);
      setLoading(false);
      return;
    }

    try {
      // **Check ownership** using Wagmi's public client
      const owner = await checkOwnership(nationId, walletAddress, publicClient, CountryMinterContract);
      if (!owner) {
        setErrorMessage("You do not own this nation.");
        setLoading(false);
        return;
      }

      // Convert value from form to a number
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
        setErrorMessage(`Invalid number input for ${field}. Please enter a valid number.`);
        setLoading(false);
        return;
      }

      console.log(`Executing function: ${field} with value: ${parsedValue}`);

      // **Get the correct update function**
      let updateFunction;
      if (field === "DEFCON") {
        updateFunction = updateDefconLevel;
      } else if (field === "ThreatLevel") {
        updateFunction = updateThreatLevel;
      } else {
        setErrorMessage(`No matching function found for ${field}`);
        setLoading(false);
        return;
      }

      // Execute the function with Wagmi's writeContractAsync
      await updateFunction(nationId, publicClient, MilitaryContract, parsedValue, writeContractAsync);

      setSuccessMessage(`${field.replace(/([A-Z])/g, " $1")} updated successfully to: ${value}`);
      setFormData(prev => ({ ...prev, [field]: "" })); // Reset form after update
      setErrorMessage(""); // Clear any previous errors
    } catch (error: any) {
      const errorMessage = parseRevertReason(error) || error.message || `Failed to update ${field}.`;
      console.error("Transaction failed:", errorMessage);
      setErrorMessage(`Transaction failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

const handleToggleWarPeace = async () => {
  setLoading(true);
  setErrorMessage("");

  // Early validation checks
  if (!nationId) {
    setErrorMessage("Nation ID not found.");
    setLoading(false);
    return;
  }
  if (!publicClient || !MilitaryContract || !writeContractAsync) {
    setErrorMessage("Missing required dependencies to toggle war/peace preference.");
    setLoading(false);
    return;
  }

  try {
    // Use Wagmi's hooks for contract interaction
    // const publicClient = usePublicClient();
    // const { writeContractAsync } = useWriteContract();

    if (!publicClient) {
      setErrorMessage("Public client is not available.");
      setLoading(false);
      return;
    }
    
    // Simulate transaction using Wagmi's publicClient
    const data = await publicClient.readContract({
      abi: MilitaryContract.abi,
      address: MilitaryContract.address,
      functionName: "toggleWarPeacePreference",
      args: [nationId],
    });

    // Simulate transaction
    const result = await publicClient.call({
      to: MilitaryContract.address,
      data: data as `0x${string}`,
    });

    console.log("Transaction Simulation Result:", result);

    if (String(result).startsWith("0x08c379a0")) {
      const errorMessage = parseRevertReason({ data: result });
      setErrorMessage(`Transaction failed: ${errorMessage}`);
      setLoading(false);
      return;
    }

    // Execute transaction if simulation passes
    await writeContractAsync({
      address: MilitaryContract.address,
      abi: MilitaryContract.abi,
      functionName: "toggleWarPeacePreference",
      args: [nationId],
    });

    // Fetch updated war/peace status using Wagmi's publicClient
    const [isAtWar, daysLeft] = await getWarPeacePreference(nationId, publicClient, MilitaryContract);
    setWarPeaceStatus(isAtWar);

    setSuccessMessage(
      `War/peace preference updated successfully. ${!isAtWar ? "Your nation is now at war." : "Your nation is now at peace."}`,
    );
  } catch (error: any) {
    const errorMessage = parseRevertReason(error) || error.message || "Failed to toggle war/peace preference.";
    console.error("Transaction failed:", errorMessage);

    // Attempt to fetch cooldown period in case of error
    try {
      let daysLeft = "";
      if (nationId) {
        [, daysLeft] = await getWarPeacePreference(nationId, publicClient, MilitaryContract);
      }
      setErrorMessage(
        `Failed to toggle war/peace preference. You need to wait 7 days before switching back to peace mode. You have ${daysLeft} days remaining.`,
      );
    } catch (innerError) {
      console.error("Failed to fetch cooldown period after error:", innerError);
      setErrorMessage(errorMessage); // Fallback to initial error message
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="font-special p-6 border-l-4 rounded-lg shadow-center bg-aged-paper text-base-content border-primary transition-all">
      <h3 className="text-2xl font-bold text-primary-content text-center">Military Settings</h3>
      <p className="text-sm text-center text-secondary-content mb-4">Modify your nations military settings below.</p>

      {/* War/Peace Status Display */}
      {warPeaceStatus !== null && (
        <div className="mb-4 p-4 bg-base-200 rounded-lg shadow-md border border-neutral">
          {warPeaceStatus ? (
            <p className="text-error font-bold text-center">Nation is ready for war</p>
          ) : (
            <p className="text-success font-bold text-center">Nation is in peace mode</p>
          )}
          <button onClick={handleToggleWarPeace} className="btn btn-primary w-full mt-2">
            Toggle War/Peace
          </button>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid gap-4">
        {Object.entries(formData).map(([key, value]) => (
          <form
            key={key}
            onSubmit={e => {
              e.preventDefault();
              handleSubmit(key as keyof typeof formData, value);
            }}
            className="p-4 bg-base-200 rounded-lg shadow-md"
          >
            <label className="text-sm font-semibold text-primary">{key.replace(/([A-Z])/g, " $1")}</label>
            <input
              type="text"
              placeholder={`Enter New ${key.replace(/([A-Z])/g, " $1")}`}
              value={value}
              onChange={e => handleInputChange(key, e.target.value)}
              className="input input-bordered w-full bg-base-100 text-base-content mt-1"
            />
            <button
              type="submit"
              className="btn btn-primary w-full flex justify-center items-center mt-3 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Updating..." : `Update ${key.replace(/([A-Z])/g, " $1")}`}
            </button>
          </form>
        ))}
      </div>

      {/* Success & Error Messages */}
      {successMessage && (
        <p className="mt-4 text-center text-sm text-success-content bg-success p-2 rounded-lg">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="mt-4 text-center text-sm text-error-content bg-error p-2 rounded-lg">{errorMessage}</p>
      )}
    </div>
  );
};

export default MilitarySettings;
