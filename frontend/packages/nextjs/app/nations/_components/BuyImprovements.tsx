"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useTheme } from "next-themes";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { simulateContract } from "wagmi/actions";
import { parseRevertReason } from "~~/utils/errorHandling";
import { deleteImprovement } from "~~/utils/improvements";
import { getImprovements } from "~~/utils/improvements";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { checkBalance } from "~~/utils/treasury";
import { wagmiConfig } from "~~/utils/wagmiConfig";

const BuyImprovement = () => {
  const { theme } = useTheme();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const { address: walletAddress } = useAccount();
  const searchParams = useSearchParams();
  const nationId = searchParams.get("id");
  const { writeContractAsync } = useWriteContract();

  const improvementKeyMapping: { [key: string]: string } = {
    airports: "buyAirport",
    banks: "buyBank",
    barracks: "buyBarracks",
    borderFortifications: "buyBorderFortification",
    borderWalls: "buyBorderWall",
    bunker: "buyBunker",
    casinos: "buyCasino",
    churches: "buyChurch",
    clinics: "buyClinic",
    drydocks: "buyDrydock",
    factories: "buyFactory",
    foreignMinistries: "buyForeignMinistry",
    forwardOperatingBases: "buyForwardOperatingBase",
    guerillaCamps: "buyGuerillaCamp",
    harbors: "buyHarbor",
    hospitals: "buyHospital",
    intelAgencies: "buyIntelAgency",
    jails: "buyJail",
    laborCamps: "buyLaborCamp",
    prisons: "buyPrison",
    radiationContainmentChambers: "buyRadiationContainmentChamber",
    redLightDistricts: "buyRedLightDistrict",
    rehabilitationFacilities: "buyRehabilitationFacility",
    satellites: "buySatellite",
    schools: "buySchool",
    shipyards: "buyShipyard",
    stadiums: "buyStadium",
    universities: "buyUniversity",
    missileDefenseSystems: "buyMissileDefense",
    munitionsFactories: "buyMunitionsFactory",
    navalAcademies: "buyNavalAcademy",
    navalConstructionYards: "buyNavalConstructionYard",
    officesOfPropaganda: "buyOfficeOfPropaganda",
    policeHeadquarters: "buyPoliceHeadquarters",
  };

  const improvementParameters: { [key: string]: any } = {
    airports: {
      Cost: "100,000 Warbucks",
      Limit: "3",
      Benefits: "Reduces aircraft purchase cost -2%, Reduces aircraft upkeep cost -2%",
    },
    banks: {
      Cost: "100,000 Warbucks",
      Limit: "5",
      Benefits: "Increases population income +7%",
    },
    barracks: {
      Cost: "50,000 Warbucks",
      Limit: "5",
      Benefits: "Increases soldier efficiency +10%, Reduces soldier upkeep cost -10%",
    },
    borderFortifications: {
      Cost: "125,000 Warbucks",
      Limit: "3",
      Benefits:
        "Raises effectiveness of defending soldiers +2%, Reduces max deployment -2%, Requires Border Wall, Cannot own if Forward Operating Base is owned",
    },
    borderWalls: {
      Cost: "60,000 Warbucks",
      Limit: "5",
      Benefits:
        "Decreases citizen count -2%, Increases population happiness +2, Improves environment (+1), Reduces criminals -1% per wall, Only one purchase at a time",
    },
    bunker: {
      Cost: "200,000 Warbucks",
      Limit: "5",
      Benefits:
        "Reduces infrastructure damage from aircraft, cruise missiles, and nukes, Requires Barracks, Cannot build if Munitions Factory or Forward Operating Base is owned",
    },
    casinos: {
      Cost: "100,000 Warbucks",
      Limit: "2",
      Benefits: "Increases happiness +1%, Decreases citizen income -1%, Decreases crime prevention",
    },
    churches: {
      Cost: "40,000 Warbucks",
      Limit: "5",
      Benefits: "Increases population happiness +1",
    },
    clinics: {
      Cost: "50,000 Warbucks",
      Limit: "5",
      Benefits: "Increases population count +2%, 2+ Clinics allow Hospital purchase, Clinics must exist for Hospital",
    },
    drydocks: {
      Cost: "100,000 Warbucks",
      Limit: "5",
      Benefits: "Allows building and maintaining Corvettes, Battleships, Cruisers, and Destroyers, Requires Harbor",
    },
    factories: {
      Cost: "150,000 Warbucks",
      Limit: "5",
      Benefits: "Decreases cruise missile cost -5%, Decreases tank cost -10%, Reduces infrastructure purchase cost -8%",
    },
    foreignMinistries: {
      Cost: "120,000 Warbucks",
      Limit: "1",
      Benefits: "Increases population income +5%",
    },
    forwardOperatingBases: {
      Cost: "125,000 Warbucks",
      Limit: "2",
      Benefits:
        "Increases ground attack effectiveness +1 per FOB, Reduces defending soldier effectiveness -3%, Requires Barracks, Cannot own with Border Fortifications or Bunker",
    },
    guerillaCamps: {
      Cost: "20,000 Warbucks",
      Limit: "5",
      Benefits: "Increases soldier efficiency +35%, Reduces soldier upkeep cost -10%, Reduces citizen income -8%",
    },
    harbors: {
      Cost: "200,000 Warbucks",
      Limit: "1",
      Benefits:
        "Increases population income +1%, Opens +1 extra trade slot, Required for Drydock, Shipyard, Naval Academy",
    },
    hospitals: {
      Cost: "180,000 Warbucks",
      Limit: "1",
      Benefits: "Increases population count +6%, Requires 2 Clinics",
    },
    intelAgencies: {
      Cost: "38,500 Warbucks",
      Limit: "5",
      Benefits: "Increases happiness +1 for tax rates >23%, Each agency allows +100 spies",
    },
    jails: {
      Cost: "25,000 Warbucks",
      Limit: "5",
      Benefits: "Incarcerates up to 500 criminals",
    },
    laborCamps: {
      Cost: "150,000 Warbucks",
      Limit: "5",
      Benefits: "Reduces infrastructure upkeep -10%, Reduces population happiness -1, Incarcerates 200 criminals",
    },
    missileDefenseSystems: {
      Cost: "90,000 Warbucks",
      Limit: "5",
      Benefits:
        "Reduces odds of successful Nuclear and Cruise Missile strikes -5%, Minimum 3 Missile Defenses required if SDI wonder owned",
    },
    munitionsFactories: {
      Cost: "200,000 Warbucks",
      Limit: "5, Requires 3 Factories and Lead resource, Cannot build if Bunkers owned",
      Benefits: "Increases enemy infrastructure damage +3%, Penalty to environment",
    },
    navalAcademies: {
      Cost: "300,000 Warbucks",
      Limit: "2, Requires Harbor",
      Benefits: "Increases navy vessel attack/defense strength +1",
    },
    navalConstructionYards: {
      Cost: "300,000 Warbucks",
      Limit: "3, Requires Harbor and navy support capabilities",
      Benefits: "Increases daily navy vessel purchase limit +1",
    },
    officesOfPropaganda: {
      Cost: "200,000 Warbucks",
      Limit: "2, Requires Forward Operating Base",
      Benefits: "Decreases enemy defending soldier effectiveness -3%",
    },
    policeHeadquarters: {
      Cost: "75,000 Warbucks",
      Limit: "5",
      Benefits: "Increases population happiness +2",
    },
    prisons: {
      Cost: "200,000 Warbucks",
      Limit: "5",
      Benefits: "Incarcerates up to 5,000 criminals",
    },
    radiationContainmentChambers: {
      Cost: "200,000 Warbucks",
      Limit: "2, Requires Radiation Cleanup resource and Bunker",
      Benefits: "Lowers global radiation affecting nation by 20%",
    },
    redLightDistricts: {
      Cost: "50,000 Warbucks",
      Limit: "2",
      Benefits: "Increases happiness +1, Penalizes environment, Increases crime",
    },
    rehabilitationFacilities: {
      Cost: "500,000 Warbucks",
      Limit: "5",
      Benefits: "Sends up to 500 criminals back into citizen population",
    },
    satellites: {
      Cost: "90,000 Warbucks",
      Limit: "5",
      Benefits: "Increases cruise missile and nuke success odds +5%, Minimum 3 Satellites required if SDI wonder owned",
    },
    schools: {
      Cost: "85,000 Warbucks",
      Limit: "5",
      Benefits:
        "Increases population income +5%, Increases literacy rate +1%, 3 Schools needed for University purchase",
    },
    shipyards: {
      Cost: "100,000 Warbucks",
      Limit: "5, Requires Harbor",
      Benefits: "Allows building and maintaining Landing Ships, Frigates, Submarines, Aircraft Carriers",
    },
    stadiums: {
      Cost: "110,000 Warbucks",
      Limit: "5",
      Benefits: "Increases population happiness +3",
    },
    universities: {
      Cost: "180,000 Warbucks",
      Limit: "2, Requires 3 Schools",
      Benefits: "Increases population income +8%, Reduces technology cost -10%, Increases literacy rate +3%",
    },
  };

  const [improvementDetails, setImprovementDetails] = useState<{ [key: string]: string }>({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [purchaseAmounts, setPurchaseAmounts] = useState<{ [key: string]: number }>({});

  const handleBuyImprovement = async (key: string) => {
    const amount = purchaseAmounts[key] || 1;
    const improvementKey = improvementKeyMapping[key];

    if (!walletAddress || !nationId || !improvementKey || !contractsData) return;

    const contracts = [
      contractsData.ImprovementsContract1,
      contractsData.ImprovementsContract2,
      contractsData.ImprovementsContract3,
      contractsData.ImprovementsContract4,
    ];

    const mappings = [
      [
        "buyAirport",
        "buyBank",
        "buyBarracks",
        "buyBorderFortification",
        "buyBorderWall",
        "buyBunker",
        "buyCasino",
        "buyChurch",
        "buyClinic",
        "buyDrydock",
        "buyFactory",
      ],
      [
        "buyForeignMinistry",
        "buyForwardOperatingBase",
        "buyGuerillaCamp",
        "buyHarbor",
        "buyHospital",
        "buyIntelAgency",
        "buyJail",
        "buyLaborCamp",
      ],
      [
        "buyPrison",
        "buyRadiationContainmentChamber",
        "buyRedLightDistrict",
        "buyRehabilitationFacility",
        "buySatellite",
        "buySchool",
        "buyShipyard",
        "buyStadium",
        "buyUniversity",
      ],
      [
        "buyMissileDefense",
        "buyMunitionsFactory",
        "buyNavalAcademy",
        "buyNavalConstructionYard",
        "buyOfficeOfPropaganda",
        "buyPoliceHeadquarters",
      ],
    ];

    let selectedContract = null;
    let contractIndex = -1;
    let improvementIndex = -1;

    for (let i = 0; i < mappings.length; i++) {
      const index = mappings[i].indexOf(improvementKey);
      if (index !== -1) {
        selectedContract = contracts[i];
        contractIndex = i + 1;
        improvementIndex = index + 1;
        break;
      }
    }

    if (!selectedContract || contractIndex === -1 || improvementIndex === -1) {
      alert("Improvement function not found in contracts");
      return;
    }

    try {
      const { request } = await simulateContract(wagmiConfig, {
        abi: selectedContract.abi,
        address: selectedContract.address,
        functionName: `buyImprovement${contractIndex}`,
        args: [amount, nationId, improvementIndex],
        account: walletAddress,
      });

      const tx = await writeContractAsync(request);
      alert("Improvement purchased successfully!");
      setRefreshTrigger(!refreshTrigger);
    } catch (err: any) {
      const message = parseRevertReason(err);
      console.error("Transaction error:", err);
      alert(message || "Transaction failed");
    }
  };

  const handleDeleteImprovement = async (key: string) => {
    const amount = purchaseAmounts[key] || 1;
    const improvementKey = improvementKeyMapping[key]?.replace("buy", "delete") || key;

    if (nationId) {
      try {
        await deleteImprovement(
          nationId,
          improvementKey,
          amount,
          publicClient,
          contractsData.ImprovementsContract1,
          contractsData.ImprovementsContract2,
          contractsData.ImprovementsContract3,
          contractsData.ImprovementsContract4,
          writeContractAsync,
        );
        alert("Improvement deleted successfully!");
        window.location.reload();
      } catch (txError) {
        console.error("Error deleting improvement:", txError);
        alert("Transaction failed: Unable to delete improvement.");
      }
    } else {
      alert("Nation ID is missing.");
    }
  };

  const fetchImprovementDetails = async () => {
    if (!nationId || !publicClient || !contractsData) return;

    try {
      const improvements = await getImprovements(
        nationId,
        contractsData.ImprovementsContract1,
        contractsData.ImprovementsContract2,
        contractsData.ImprovementsContract3,
        contractsData.ImprovementsContract4,
        publicClient,
      );
      const warBuckBalance = await checkBalance(nationId, publicClient, contractsData.TreasuryContract);

      const details: { [key: string]: string } = {};

      improvements?.forEach(improvement => {
        const key = improvement.name.charAt(0).toLowerCase() + improvement.name.slice(1).replace(/\s+/g, "");
        details[key] = improvement.improvementCount.toString();
      });

      details["warBucksBalance"] = (warBuckBalance / BigInt(10 ** 18)).toLocaleString();
      setImprovementDetails(details);
    } catch (error) {
      console.error("Error fetching infrastructure details:", error);
    }
  };

  useEffect(() => {
    fetchImprovementDetails();
  }, [nationId, publicClient, contractsData, refreshTrigger]);

  return (
    <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
      <h2 className="text-2xl font-bold text-primary-content text-center mb-4">🏗️ Manage Improvements</h2>
      <div className="text-lg text-center font-semibold bg-base-200 p-3 rounded-lg shadow-md mb-6">
        Warbucks Balance: {improvementDetails["warBucksBalance"] || "0"}
      </div>

      <Tooltip.Provider>
        <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
          <thead className="bg-primary text-primary-content">
            <tr>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Owned</th>
              <th className="p-3 text-left">Amount (1-5)</th>
              <th className="p-3 text-left">Buy</th>
              <th className="p-3 text-left">Delete</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(improvementKeyMapping).map(key => (
              <tr key={key} className="border-b border-neutral">
                <Tooltip.Root delayDuration={100}>
                  <Tooltip.Trigger asChild>
                    <td className="p-3 capitalize cursor-pointer">{key.replace(/([A-Z])/g, " $1")}</td>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      align="center"
                      className="bg-gray-800 text-white p-3 rounded-md text-sm shadow-lg max-w-xs break-words z-50"
                    >
                      <div>
                        <strong>Cost:</strong> {improvementParameters[key]?.Cost || "N/A"}
                      </div>
                      <div>
                        <strong>Limit:</strong> {improvementParameters[key]?.Limit || "N/A"}
                      </div>
                      <div>
                        <strong>Benefits:</strong> {improvementParameters[key]?.Benefits || "N/A"}
                      </div>
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                <td className="p-3">{improvementDetails[key] || "0"}</td>
                <td className="p-3">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={purchaseAmounts[key] || 1}
                    onChange={e => setPurchaseAmounts({ ...purchaseAmounts, [key]: Number(e.target.value) })}
                    className="input input-bordered w-16 bg-base-100 text-base-content"
                  />
                </td>
                <td className="p-3">
                  <button onClick={() => handleBuyImprovement(key)} className="btn btn-success w-full">
                    Buy
                  </button>
                </td>
                <td className="p-3">
                  {parseInt(improvementDetails[key] || "0") > 0 && (
                    <button onClick={() => handleDeleteImprovement(key)} className="btn btn-error w-full">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Tooltip.Provider>
    </div>
  );
};

export default BuyImprovement;
