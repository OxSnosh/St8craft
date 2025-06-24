"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { parseRevertReason } from "../../../utils/errorHandling";
import {
  buyF15Eagle,
  buyF22Raptor,
  buyF35Lightning,
  buyF86Sabre,
  buyF100SuperSabre,
  buyMig15,
  buyP51Mustang,
  buySu30Mki,
  buyYak9,
  getF15EagleCount,
  getF22RaptorCount,
  getF35LightningCount,
  getF86SabreCount,
  getF100SuperSabreCount,
  getMig15Count,
  getP51MustangCount,
  getSu30MkiCount,
  getYak9Count,
  scrapF15Eagle,
  scrapF22Raptor,
  scrapF35Lightning,
  scrapF86Sabre,
  scrapF100SuperSabre,
  scrapMig15,
  scrapP51Mustang,
  scrapSu30Mki,
  scrapYak9,
} from "../../../utils/fighters";
// import { ethers } from "ethers";
import { useTheme } from "next-themes";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";

const BuyFighters = () => {
  const { theme } = useTheme();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const { address: walletAddress } = useAccount();
  const searchParams = useSearchParams();
  const nationId = searchParams.get("id");
  const FightersContract = contractsData?.FightersContract;
  const FightersMarketplace1 = contractsData?.FightersMarketplace1;
  const FightersMarketplace2 = contractsData?.FightersMarketplace2;
  const { writeContractAsync } = useWriteContract();

  const fightersList = [
    { key: "yak9", buy: buyYak9, scrap: scrapYak9 },
    { key: "p51Mustang", buy: buyP51Mustang, scrap: scrapP51Mustang },
    { key: "f86Sabre", buy: buyF86Sabre, scrap: scrapF86Sabre },
    { key: "mig15", buy: buyMig15, scrap: scrapMig15 },
    { key: "f100SuperSabre", buy: buyF100SuperSabre, scrap: scrapF100SuperSabre },
    { key: "f35Lightning", buy: buyF35Lightning, scrap: scrapF35Lightning },
    { key: "f15Eagle", buy: buyF15Eagle, scrap: scrapF15Eagle },
    { key: "su30Mki", buy: buySu30Mki, scrap: scrapSu30Mki },
    { key: "f22Raptor", buy: buyF22Raptor, scrap: scrapF22Raptor },
  ];

  const [fightersDetails, setFighterDetails] = useState<{ [key: string]: string }>({});
  const [purchaseAmounts, setPurchaseAmounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchFighterDetails = async () => {
      if (!nationId || !publicClient || !FightersContract) return;

      try {
        const details = await Promise.all(
          fightersList.map(async fighter => {
            const getCountFunction = {
              yak9: getYak9Count,
              p51Mustang: getP51MustangCount,
              f86Sabre: getF86SabreCount,
              mig15: getMig15Count,
              f100SuperSabre: getF100SuperSabreCount,
              f35Lightning: getF35LightningCount,
              f15Eagle: getF15EagleCount,
              su30Mki: getSu30MkiCount,
              f22Raptor: getF22RaptorCount,
            }[fighter.key];

            if (!getCountFunction) return { key: fighter.key, count: "0" };

            const count = await getCountFunction(nationId, publicClient, FightersContract);
            return { key: fighter.key, count: count.toString() };
          }),
        );

        const detailsObject = details.reduce(
          (acc, { key, count }) => {
            acc[key] = count;
            return acc;
          },
          {} as { [key: string]: string },
        );

        setFighterDetails(detailsObject);
      } catch (error) {
        console.error("Error fetching fighter details:", error);
      }
    };

    fetchFighterDetails();
  }, [nationId, publicClient, FightersContract]);

  const handleTransaction = async (key: string, action: "buy" | "scrap") => {
    const amount = purchaseAmounts[key] || 1;
    if (!nationId) {
      console.error("Nation ID is null");
      return;
    }

    const fighter = fightersList.find(f => f.key === key);
    if (!fighter) {
      console.error("Invalid fighter key:", key);
      return;
    }

    const marketplace = ["f35Lightning", "f15Eagle", "su30Mki", "f22Raptor"].includes(key)
      ? FightersMarketplace2
      : FightersMarketplace1;

    try {
      if (action === "buy") {
        await fighter.buy(nationId, amount, publicClient, marketplace, writeContractAsync);
      } else {
        await fighter.scrap(nationId, amount, publicClient, FightersContract, writeContractAsync);
      }

      alert(`Successfully ${action === "buy" ? "purchased" : "scrapped"} ${amount} ${key}`);
    } catch (error: any) {
      console.error(`Transaction failed:`, error);
      alert(`Transaction failed: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
      <h2 className="text-2xl font-bold text-primary-content text-center mb-4">✈️ Fighter Details</h2>

      <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
        <thead className="bg-primary text-primary-content">
          <tr>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Available</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fightersList.map(({ key }) => (
            <tr key={key} className="border-b border-neutral">
              <td className="p-3 capitalize">{key.replace(/([A-Z])/g, " $1")}</td>
              <td className="p-3">{fightersDetails[key] || "0"}</td>
              <td className="p-3">
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={purchaseAmounts[key] || 1}
                  onChange={e => setPurchaseAmounts({ ...purchaseAmounts, [key]: Number(e.target.value) })}
                  className="input input-bordered w-16 bg-base-100 text-base-content text-center"
                />
              </td>
              <td className="p-3 flex gap-2">
                <button onClick={() => handleTransaction(key, "buy")} className="btn btn-success">
                  Buy
                </button>
                <button onClick={() => handleTransaction(key, "scrap")} className="btn btn-error">
                  Scrap
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BuyFighters;
