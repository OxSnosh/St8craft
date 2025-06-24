"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
// import { ethers } from "ethers";
// import { AbiCoder } from "ethers/lib/utils";
import { useTheme } from "next-themes";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import {
  getSenatorVotes,
  getSenators,
  isSanctioned,
  isSenator,
  liftSanctionVote,
  sanctionTeamMember,
  voteForSenator,
} from "~~/utils/senate";

const Senate = () => {
  const { theme } = useTheme();
  const allContractsData = useAllContracts();
  const { address: walletAddress } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const searchParams = useSearchParams();
  const nationId = searchParams.get("id");

  const [team, setTeam] = useState<string>("");
  const [isUserSenator, setIsUserSenator] = useState(false);
  const [teamMemberId, setTeamMemberId] = useState("");
  const [senatorId, setSenatorId] = useState("");
  const [teamSenators, setTeamSenators] = useState<string[]>([]);
  const [topSenatorVotes, setTopSenatorVotes] = useState<string[]>([]);
  const [sanctionMessage, setSanctionMessage] = useState<string>("");

  useEffect(() => {
    if (nationId) {
      fetchSenateDetails();
    }
  }, [nationId]);

  const fetchSenateDetails = async () => {
    if (!nationId || !publicClient || !allContractsData.SenateContract) return;

    try {
      // Get senator status
      const senatorStatus = await isSenator(nationId, allContractsData.SenateContract, publicClient);

      // Get team number
      const teamData = (await publicClient.readContract({
        abi: allContractsData.CountryParametersContract.abi,
        address: allContractsData.CountryParametersContract.address,
        functionName: "getTeam",
        args: [nationId],
      })) as string;

      console.log("Team Data:", teamData);

      const sanctionedStatus = await isSanctioned(nationId, teamData, allContractsData.SenateContract, publicClient);
      console.log("Sanctioned Status:", sanctionedStatus);

      // If sanctioned, update the sanction message
      if (sanctionedStatus) {
        setSanctionMessage(`You are sanctioned on team ${teamData}`);
      } else {
        setSanctionMessage("");
      }

      // Get list of senators for the team
      const senatorsList = await getSenators(allContractsData.SenateContract, publicClient, teamData);

      console.log("Senators List:", senatorsList);

      // Filter senators belonging to the same team
      const teamSenators = senatorsList
        .filter((senator: { team: string }) => senator.team === teamData)
        .map((s: { nationId: string }) => s.nationId);

      console.log("Team Senators:", teamSenators);

      // Get senator votes and determine top 5 most frequent
      const votesArray = await getSenatorVotes(allContractsData.SenateContract, publicClient, teamData);
      const top5Votes = getTop5Frequent(votesArray);

      console.log("Top 5 Votes:", top5Votes);

      // Update state
      setIsUserSenator(senatorStatus);
      setTeam(teamData.toString());
      setTeamSenators(teamSenators);
      setTopSenatorVotes(top5Votes);
    } catch (error) {
      console.error("Error fetching senate details:", error);
    }
  };

  // Function to get the top 5 most frequently voted senator nationIds
  function getTop5Frequent(arr: string[]): string[] {
    const countMap: { [key: string]: number } = {};
    arr.forEach(id => (countMap[id] = (countMap[id] || 0) + 1));
    return Object.entries(countMap)
      .sort((a, b) => b[1] - a[1]) // Sort by frequency descending
      .slice(0, 5) // Take top 5
      .map(entry => entry[0]); // Extract nationId
  }

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

  const handleVoteForSenator = async () => {
    if (!nationId || !senatorId) return;

    const contractData = allContractsData.SenateContract;
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
        functionName: "voteForSenator",
        args: [nationId, senatorId],
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

      // Execute the transaction if the simulation is successful
      await writeContractAsync({
        abi: contractData.abi,
        address: contractData.address,
        functionName: "voteForSenator",
        args: [nationId, senatorId],
      });

      alert("Vote submitted!");
    } catch (error: any) {
      const errorMessage = parseRevertReason(error);
      console.error("Transaction failed:", errorMessage);
      alert(`Transaction failed: ${errorMessage}`);
    }
  };

  const handleSanctionTeamMember = async () => {
    if (!nationId || !teamMemberId) return;

    const contractData = allContractsData.SenateContract;
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
        functionName: "sanctionTeamMember",
        args: [nationId, teamMemberId],
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

      // Execute the transaction if the simulation is successful
      await writeContractAsync({
        abi: contractData.abi,
        address: contractData.address,
        functionName: "sanctionTeamMember",
        args: [nationId, teamMemberId],
      });

      alert("Sanctioned team member successfully!");
    } catch (error: any) {
      const errorMessage = parseRevertReason(error);
      console.error("Transaction failed:", errorMessage);
      alert(`Transaction failed: ${errorMessage}`);
    }
  };

  const handleLiftSanctionVote = async () => {
    if (!nationId || !teamMemberId) return;

    const contractData = allContractsData.SenateContract;
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
        functionName: "liftSanctionVote",
        args: [nationId, teamMemberId],
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
        functionName: "liftSanctionVote",
        args: [nationId, teamMemberId],
      });

      alert("Sanction lifted!");
    } catch (error: any) {
      const errorMessage = parseRevertReason(error);
      console.error("Transaction failed:", errorMessage);
      alert(`Transaction failed: ${errorMessage}`);
    }
  };

  return (
    <div className="font-special p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
      <h2 className="text-2xl font-bold text-primary-content text-center mb-4">Senate Management</h2>

      {/* Team Section */}
      {team && (
        <div className="p-4 bg-base-200 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-primary">Team:</h3>
          <p className="text-base">Team: {team}</p>
          {sanctionMessage && <p className="text-error font-semibold mt-2">{sanctionMessage}</p>}

          {isUserSenator && <p className="text-success-content font-semibold mt-2">You are a senator of team {team}</p>}
        </div>
      )}

      {/* Team Senators */}
      {teamSenators.length > 0 && (
        <div className="p-4 bg-base-200 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold text-primary">Senators for Team {team}:</h3>
          <ul className="list-disc ml-4">
            {teamSenators.map(senId => (
              <li key={senId} className="text-base">
                {senId}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top 5 Most Frequent Senator Votes */}
      {topSenatorVotes.length > 0 && (
        <div className="p-4 bg-base-200 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold text-primary">Top 5 Most Voted Senators:</h3>
          <ul className="list-decimal ml-4">
            {topSenatorVotes.map(voteId => (
              <li key={voteId} className="text-base">
                {voteId}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Vote for Senator */}
      <div className="p-4 bg-base-200 rounded-lg shadow-md mt-4">
        <label className="block text-sm font-medium text-primary">Senator ID to Vote:</label>
        <input
          type="text"
          value={senatorId}
          onChange={e => setSenatorId(e.target.value)}
          className="input input-bordered w-full bg-base-100 text-base-content mt-1"
          placeholder="Enter Senator ID"
        />
        <button onClick={handleVoteForSenator} className="btn btn-primary w-full mt-3">
          Vote for Senator
        </button>
      </div>

      {/* Actions for Senators */}
      {isUserSenator && (
        <div className="mt-4 p-4 bg-base-200 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-primary">Sanctions Management</h3>

          <label className="block text-sm font-medium text-primary mt-2">Team Member ID:</label>
          <input
            type="text"
            value={teamMemberId}
            onChange={e => setTeamMemberId(e.target.value)}
            className="input input-bordered w-full bg-base-100 text-base-content mt-1"
            placeholder="Enter Team Member ID"
          />

          <div className="mt-3 flex gap-2">
            <button onClick={handleSanctionTeamMember} className="btn btn-error flex-1">
              Sanction Member
            </button>

            <button onClick={handleLiftSanctionVote} className="btn btn-success flex-1">
              Lift Sanction
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Senate;
