"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { parseRevertReason } from "../../../utils/errorHandling";
import {
  acceptTrade,
  cancelTrade,
  getBonusResources,
  getPlayerResources,
  getProposedTradingPartners,
  getResources,
  getTradingPartners,
  proposeTrade,
  removeTradingPartner,
} from "../../../utils/resources";
// import { ethers } from "ethers";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { tokensOfOwner } from "~~/utils/countryMinter";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";

const ManageTrades = () => {
  const searchParams = useSearchParams();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const { address: walletAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const ResourcesContract = contractsData?.ResourcesContract;
  const CountryMinter = contractsData?.CountryMinter;

  const [loading, setLoading] = useState(true);
  const [mintedNations, setMintedNations] = useState<{ id: string; name: string }[]>([]);
  const [selectedNationId, setSelectedNationId] = useState<string | null>(null);
  const [selectedNationResources, setSelectedNationResources] = useState<any>(null);
  const [tradingPartnerId, setTradingPartnerId] = useState<string>("");
  const [tradingPartnerResources, setTradingPartnerResources] = useState<any>(null);
  const [proposedTrades, setProposedTrades] = useState<any[]>([]);
  const [tradingPartners, setTradingPartners] = useState<any[]>([]);

  const resourceNames = [
    "Aluminium",
    "Cattle",
    "Coal",
    "Fish",
    "Furs",
    "Gems",
    "Gold",
    "Iron",
    "Lead",
    "Lumber",
    "Marble",
    "Oil",
    "Pigs",
    "Rubber",
    "Silver",
    "Spices",
    "Sugar",
    "Uranium",
    "Water",
    "Wheat",
    "Wine",
  ];

  useEffect(() => {
    const fetchMintedNations = async () => {
      setLoading(true);
      if (!publicClient || !ResourcesContract || !CountryMinter) {
        console.error("Missing required data: publicClient, ResourcesContract, or CountryMinter.");
        setLoading(false);
        return;
      }
      if (!walletAddress) {
        console.error("Wallet address is undefined.");
        setLoading(false);
        return;
      }

      try {
        const ownedNations = await tokensOfOwner(walletAddress, publicClient, CountryMinter);
        const nations = ownedNations.map((tokenId: string) => ({
          id: tokenId,
          name: `Nation ${tokenId}`,
        }));
        console.log("Nations:", nations);
        setMintedNations(nations);
      } catch (err) {
        console.error("Error fetching minted nations:", err);
        setMintedNations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMintedNations();
  }, [ResourcesContract, CountryMinter, publicClient, walletAddress]);

  useEffect(() => {
    if (selectedNationId) {
      fetchProposedTrades();
    }
  }, [selectedNationId]);

  const handleNationChange = async (nationId: string) => {
    setSelectedNationId(nationId);
    const resources: any = await fetchIndividualResources(nationId);
    setSelectedNationResources(resources);
  };

  useEffect(() => {
    const fetchResourcesForTradingPartner = async () => {
      if (tradingPartnerId) {
        const resources = await fetchIndividualResources(tradingPartnerId);
        setTradingPartnerResources(resources);
      } else {
        setTradingPartnerResources(null);
      }
    };

    fetchResourcesForTradingPartner();
  }, [tradingPartnerId, selectedNationId, ResourcesContract, publicClient]);

  const fetchIndividualResources = async (nationId: string) => {
    if (!ResourcesContract || !publicClient) {
      console.error("Missing required data: ResourcesContract or publicClient.");
      return;
    }
    const individualResources = await getPlayerResources(nationId, ResourcesContract, publicClient);
    return individualResources;
  };

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleProposeTrade = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Early validation checks
    if (!selectedNationId) {
      setErrorMessage("Selected nation ID is missing.");
      setLoading(false);
      return;
    }
    if (!tradingPartnerId) {
      setErrorMessage("Trading partner ID is missing.");
      setLoading(false);
      return;
    }
    if (!ResourcesContract || !ResourcesContract.address || !ResourcesContract.abi) {
      setErrorMessage("Resources contract is not available.");
      setLoading(false);
      return;
    }
    if (!writeContractAsync) {
      setErrorMessage("Missing writeContractAsync function.");
      setLoading(false);
      return;
    }

    try {
      if (!publicClient) {
        setErrorMessage("Public client is not available.");
        setLoading(false);
        return;
      }
      const contractData = ResourcesContract;

      // Simulate transaction using Wagmi's publicClient
      const data = await publicClient.readContract({
        abi: contractData.abi,
        address: contractData.address,
        functionName: "proposeTrade",
        args: [selectedNationId, tradingPartnerId],
      });

      // Simulate transaction
      const result = await publicClient.call({
        to: contractData.address,
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
        address: contractData.address,
        abi: contractData.abi,
        functionName: "proposeTrade",
        args: [selectedNationId, tradingPartnerId],
      });

      // Refresh the state and show success message
      fetchProposedTrades();
      setSuccessMessage("Trade proposal sent successfully.");
    } catch (error: any) {
      const errorMessage = parseRevertReason(error) || error.message || "Failed to propose trade.";
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTrade = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!ResourcesContract || !ResourcesContract.address || !ResourcesContract.abi) {
      setErrorMessage("Resources contract is not available.");
      setLoading(false);
      return;
    }
    if (!writeContractAsync) {
      setErrorMessage("Missing writeContractAsync function.");
      setLoading(false);
      return;
    }

    try {
      if (selectedNationId && tradingPartnerId) {
        await acceptTrade(selectedNationId, tradingPartnerId, ResourcesContract, writeContractAsync);
      } else {
        setErrorMessage("Selected nation ID or trading partner ID is missing.");
      }
      fetchProposedTrades();
      setSuccessMessage("Trade accepted successfully.");
    } catch (error: any) {
      const errorMessage = parseRevertReason(error) || error.message || "Failed to accept trade.";
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTrade = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!ResourcesContract || !ResourcesContract.address || !ResourcesContract.abi) {
      setErrorMessage("Resources contract is not available.");
      setLoading(false);
      return;
    }
    if (!writeContractAsync) {
      setErrorMessage("Missing writeContractAsync function.");
      setLoading(false);
      return;
    }

    try {
      if (selectedNationId && tradingPartnerId) {
        await cancelTrade(selectedNationId, tradingPartnerId, ResourcesContract, writeContractAsync);
      } else {
        setErrorMessage("Selected nation ID or trading partner ID is missing.");
      }
      fetchProposedTrades();
      setSuccessMessage("Trade canceled successfully.");
    } catch (error: any) {
      const errorMessage = parseRevertReason(error) || error.message || "Failed to cancel trade.";
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchProposedTrades = async () => {
    console.log("Fetching proposed trades...");
    console.log("Selected nation ID:", selectedNationId);

    if (selectedNationId) {
      console.log("Selected nation ID:", selectedNationId);
      const trades = await getProposedTradingPartners(selectedNationId, publicClient, ResourcesContract);
      console.log("Proposed trades:", trades);
      setProposedTrades(trades);
    } else {
      console.error("Selected nation ID is null.");
    }
  };

  useEffect(() => {
    const fetchTradingPartners = async () => {
      if (!selectedNationId || !ResourcesContract || !publicClient) {
        setTradingPartners([]);
        return;
      }

      setTradingPartners([]); // Clear immediately for clean switch

      const partnerIds = await getTradingPartners(selectedNationId, ResourcesContract, publicClient);

      const partnerData = await Promise.all(
        partnerIds.map(async (id: string) => {
          const resources = await getPlayerResources(id.toString(), ResourcesContract, publicClient);

          return { id, resources };
        }),
      );

      setTradingPartners(partnerData);
    };

    fetchTradingPartners();
  }, [selectedNationId, ResourcesContract, publicClient]);

  const handleRemoveTradingPartner = async (partnerId: string) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedNationId) {
      setErrorMessage("Selected nation ID is missing.");
      setLoading(false);
      return;
    }
    if (!ResourcesContract || !ResourcesContract.address || !ResourcesContract.abi) {
      setErrorMessage("Resources contract is not available.");
      setLoading(false);
      return;
    }
    if (!writeContractAsync) {
      setErrorMessage("Missing writeContractAsync function.");
      setLoading(false);
      return;
    }

    try {
      await removeTradingPartner(selectedNationId, partnerId, ResourcesContract, writeContractAsync);
      setSuccessMessage(`Trading partner ${partnerId} removed successfully.`);
    } catch (error: any) {
      const errorMessage = parseRevertReason(error) || error.message || "Failed to remove trading partner.";
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
      <h2 className="text-2xl font-bold text-primary-content text-center mb-4">Trading Partners</h2>

      <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md">
        <thead className="bg-primary text-primary-content">
          <tr>
            <th className="p-3 text-left">Your Nations</th>
            <th className="p-3 text-left">Trading Partner</th>
          </tr>
        </thead>
        <tbody>
          <tr>
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
            <td className="p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Trading Partner Nation ID"
                  value={tradingPartnerId}
                  onChange={e => setTradingPartnerId(e.target.value)}
                  className="input input-bordered w-full bg-base-100 text-base-content"
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="p-3">
              {selectedNationResources && (
                <pre className="bg-base-100 p-2 rounded">{JSON.stringify(selectedNationResources, null, 2)}</pre>
              )}
            </td>
            <td className="p-3">
              {tradingPartnerResources && (
                <pre className="bg-base-100 p-2 rounded">{JSON.stringify(tradingPartnerResources, null, 2)}</pre>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {selectedNationId && tradingPartnerId && (
        <button onClick={handleProposeTrade} className="btn btn-accent w-full mt-4">
          Propose Trade
        </button>
      )}

      <h3 className="text-xl font-semibold text-primary mt-6 mb-2">Proposed Trades</h3>
      <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md">
        <tbody>
          {proposedTrades.length > 0 ? (
            proposedTrades.map((trade, index) => (
              <tr key={index} className="border-b border-neutral">
                <td className="p-3">Trade ID: {trade.tradeId}</td>
                <td className="p-3">Proposing Nation: {trade.proposingNationId}</td>
                <td className="p-3">Proposed Nation: {trade.proposedNationId}</td>
                {walletAddress && (
                  <>
                    <td>
                      <button onClick={() => handleCancelTrade()} className="btn btn-error">
                        Cancel Trade
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleAcceptTrade()} className="btn btn-success">
                        Accept Trade
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-3 text-center text-sm text-secondary-content">No proposed trades.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3 className="text-xl font-semibold text-primary mt-6 mb-2">Active Trading Partners</h3>
      <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md">
        <tbody>
          {tradingPartners.length > 0 ? (
            tradingPartners.map(partner => (
              <tr key={partner.id} className="border-b border-neutral">
                <td className="p-3">Nation {partner.id.toString()}</td>
                <td>
                  <button onClick={() => handleRemoveTradingPartner(partner.id)} className="btn btn-warning">
                    Remove Nation {partner.id.toString()} ({partner.resources?.[0]}, {partner.resources?.[1]})
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-3 text-center text-sm text-secondary-content">No active trading partners.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTrades;
