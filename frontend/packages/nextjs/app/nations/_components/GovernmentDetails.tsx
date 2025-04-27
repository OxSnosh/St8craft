"use client";

import React, { useEffect, useState } from "react";
import { usePublicClient, useAccount, useWriteContract } from "wagmi";
import { useSearchParams } from "next/navigation";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useTheme } from "next-themes";
import { 
  setRulerName,
  setNationName, 
  setCapitalCity, 
  setNationSlogan, 
  setAlliance, 
  setTeam, 
  setGovernment, 
  setReligion
} from "~~/utils/countryParameters";
import { checkBalance } from "~~/utils/treasury";
import { checkOwnership } from "~~/utils/countryMinter";
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';

const GovernmentDetails = () => {
  const { theme } = useTheme();
  const { address: walletAddress } = useAccount();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const searchParams = useSearchParams();
  const countryParametersContract = contractsData?.CountryParametersContract;
  const TreasuryContract = contractsData?.TreasuryContract;
  const CountryMinterContract = contractsData?.CountryMinter;

  const { writeContractAsync } = useWriteContract();
  const nationId = searchParams.get("id");

  const [formData, setFormData] = useState({
    rulerName: "",
    nationName: "",
    capitalCity: "",
    nationSlogan: "",
    team: "",
    government: "",
    religion: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const functionMappings: { [key: string]: string } = {
    rulerName: "setRulerName",
    nationName: "setNationName",
    capitalCity: "setCapitalCity",
    nationSlogan: "setNationSlogan",
    team: "setTeam",
    government: "setGovernment",
    religion: "setReligion",
  };

  const stringFunctionFields = new Set([
    "rulerName",
    "nationName",
    "capitalCity",
    "nationSlogan",
    "alliance",
  ]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const updateFunctions: { [key: string]: Function } = {
    rulerName: setRulerName,
    nationName: setNationName,
    capitalCity: setCapitalCity,
    nationSlogan: setNationSlogan,
    alliance: setAlliance,
    team: setTeam,
    government: setGovernment,
    religion: setReligion,
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (field: keyof typeof formData, value: string) => {
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
    if (!countryParametersContract || !publicClient || !writeContractAsync) {
        setErrorMessage("Missing required dependencies to update nation details.");
        setLoading(false);
        return;
    }
    if (!value.trim()) {
        setErrorMessage(`${field.replace(/([A-Z])/g, " $1")} cannot be empty.`);
        setLoading(false);
        return;
    }



    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();

        // **Check ownership**
        const owner = await checkOwnership(nationId, walletAddress, publicClient, CountryMinterContract);
        if (!owner) {
            setErrorMessage("You do not own this nation.");
            setLoading(false);
            return;
        }

        const parsedNationId = parseInt(nationId, 10);
        if (isNaN(parsedNationId)) {
            setErrorMessage("Invalid nation ID: Not a number.");
            setLoading(false);
            return;
        }

        console.log("Parsed Nation ID:", parsedNationId);
        const balance = await checkBalance(nationId, publicClient, TreasuryContract);
        console.log("Balance:", balance.toString());
        console.log("Nation ID:", nationId);
        console.log("Wallet Address:", walletAddress);
        console.log("Public Client:", publicClient);
        console.log("Country Parameters Contract:", countryParametersContract);
        if (balance < 20000000 && (field === "rulerName" || field === "nationName")) {
          setErrorMessage("Insufficient balance to update " + field.replace(/([A-Z])/g, ' $1'));
          setLoading(false);
          return;
        }

        let formattedArgs: any[];

        if (["rulerName", "nationName", "capitalCity", "nationSlogan", "alliance"].includes(field)) {
            formattedArgs = [value, parsedNationId]; // ✅ Order: (value, uint)
        } else if (["team", "government", "religion"].includes(field)) {
            const parsedValue = parseInt(value, 10);
            if (isNaN(parsedValue)) {
                setErrorMessage(`Invalid number input for ${field}. Please enter a valid number.`);
                setLoading(false);
                return;
            }
            formattedArgs = [parsedNationId, parsedValue]; // ✅ Order: (uint, value)
        } else {
            setErrorMessage(`No matching function found for ${field}`);
            setLoading(false);
            return;
        }

        console.log(`Executing function: ${field} with params:`, formattedArgs);

        // ✅ Call the correct update function
        await updateFunctions[field](parsedNationId.toString(), publicClient, countryParametersContract, value, writeContractAsync);

        setSuccessMessage(`${field.replace(/([A-Z])/g, " $1")} updated successfully to: ${value}`);
        setFormData(prev => ({ ...prev, [field]: "" })); // Reset field after update
        setErrorMessage(""); // Clear any previous errors

    } catch (error: any) {
        const errorMessage = parseRevertReason(error) || error.message || `Failed to update ${field}.`;
        console.error("Transaction failed:", errorMessage);
        setErrorMessage(`Transaction failed: ${errorMessage}`);
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="font-special p-6 border-l-4 rounded-lg shadow-center bg-aged-paper text-base-content border-primary transition-all">
      <h3 className="text-2xl font-bold text-primary-content text-center">
        <a href="gameplay/#country-parameters">Update Nation Details</a>
      </h3>
      <p className="text-sm text-center text-secondary-content mb-4">
        Modify your nation's attributes below.
      </p>
  
      {successMessage && (
        <p className="mt-4 text-center text-sm text-success-content bg-success p-2 rounded-lg">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="mt-4 text-center text-sm text-error-content bg-error p-2 rounded-lg">
          {errorMessage}
        </p>
      )}
  
      {Object.entries(formData).map(([key, value]) => (
        <form
          key={key}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(key as keyof typeof formData, value);
          }}
          className="p-4 bg-base-200 rounded-lg shadow-md mb-4"
        >
          <label className="text-sm font-semibold text-primary">
            {key.replace(/([A-Z])/g, " $1")}
          </label>
  
          {/* FIELD INPUT HANDLING */}
          {key === "government" ? (
            // government = select dropdown
            <select
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="select select-bordered w-full bg-base-100 text-base-content mt-1"
            >
              <option value="">Select Government Type</option>
              <option value="0">Anarchy (0)</option>
              <option value="1">Capitalism (1)</option>
              <option value="2">Communist (2)</option>
              <option value="3">Democracy (3)</option>
              <option value="4">Dictatorship (4)</option>
              <option value="5">Federal Government (5)</option>
              <option value="6">Monarchy (6)</option>
              <option value="7">Republic (7)</option>
              <option value="8">Revolutionary (8)</option>
              <option value="9">Totalitarian (9)</option>
              <option value="10">Transitional (10)</option>
            </select>
          ) : key === "religion" ? (
            // religion = select dropdown
            <select
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="select select-bordered w-full bg-base-100 text-base-content mt-1"
            >
              <option value="">Select Religion</option>
              <option value="0">None (0)</option>
              <option value="1">Mixed (1)</option>
              <option value="2">Baha'i Faith (2)</option>
              <option value="3">Buddhism (3)</option>
              <option value="4">Christianity (4)</option>
              <option value="5">Confucianism (5)</option>
              <option value="6">Hinduism (6)</option>
              <option value="7">Islam (7)</option>
              <option value="8">Jainism (8)</option>
              <option value="9">Judaism (9)</option>
              <option value="10">Norse (10)</option>
              <option value="11">Shinto (11)</option>
              <option value="12">Sikhism (12)</option>
              <option value="13">Taoism (13)</option>
              <option value="14">Voodoo (14)</option>
            </select>
          ) : (
            // team = number input (0-15); all else = text input
            <input
              type={key === "team" ? "number" : "text"}
              placeholder={
                key === "team"
                  ? "Enter Team ID (0-15)"
                  : `Enter New ${key.replace(/([A-Z])/g, " $1")}`
              }
              value={value}
              onChange={(e) => {
                let newValue = e.target.value;
                if (key === "team") {
                  const num = parseInt(newValue, 10);
                  if (newValue === "" || (num >= 0 && num <= 15)) {
                    handleInputChange(key, newValue);
                  }
                } else {
                  handleInputChange(key, newValue);
                }
              }}
              min={key === "team" ? 0 : undefined}
              max={key === "team" ? 15 : undefined}
              className="input input-bordered w-full bg-base-100 text-base-content mt-1"
            />
          )}
  
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="btn btn-primary w-full mt-3 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : `Update ${key.replace(/([A-Z])/g, " $1")}`}
          </button>
  
          {/* SPECIAL WARNING FOR Ruler Name and Nation Name */}
          {(key === "rulerName" || key === "nationName") && (
            <p className="text-xs text-warning mt-1">
              ⚠️ Updating this will cost 20,000,000 WBX
            </p>
          )}
        </form>
      ))}
    </div>
  );  
};

export default GovernmentDetails;
