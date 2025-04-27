"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { getWonders, deleteWonder } from "~~/utils/wonders";
import { checkBalance } from "~~/utils/treasury";
import { useTheme } from "next-themes";
import { parseRevertReason } from "~~/utils/errorHandling";
import { simulateContract } from "wagmi/actions";
import { wagmiConfig } from "~~/utils/wagmiConfig";
import * as Tooltip from '@radix-ui/react-tooltip'; 

const BuyWonder = () => {
  const { theme } = useTheme();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const { address: walletAddress } = useAccount();
  const searchParams = useSearchParams();
  const nationId = searchParams.get("id");
  const { writeContractAsync } = useWriteContract();

  const wonderKeyMapping = {
    agricultureDevelopmentProgram: "buyAgriculturalDevelopmentProgram",
    airDefenseNetwork: "buyAirDefenseNetwork",
    centralIntelligenceAgency: "buyCentralIntelligenceAgency",
    disasterReliefAgency: "buyDisasterReliefAgency",
    empWeaponization: "buyEmpWeaponization",
    falloutShelterSystem: "buyFalloutShelterSystem",
    federalAidCommission: "buyFederalAidCommission",
    federalReserve: "buyFederalReserve",
    foreignAirForceBase: "buyForeignAirForceBase",
    foreignArmyBase: "buyForeignArmyBase",
    foreignNavalBase: "buyForeignNavalBase",
    greatMonument: "buyGreatMonument",
    greatTemple: "buyGreatTemple",
    greatUniversity: "buyGreatUniversity",
    hiddenNuclearMissileSilos: "buyHiddenNuclearMissileSilo",
    interCeptorMissileSystem: "buyInterceptorMissileSystem",
    internet: "buyInternet",
    interstateSystem: "buyInterstateSystem",
    manhattanProject: "buyManhattanProject",
    miningIndustryConsortium: "buyMiningIndustryConsortium",
    movieIndustry: "buyMovieIndustry",
    nationalCemetary: "buyNationalCemetary",
    nationalEnvironmentalOffice: "buyNationalEnvironmentalOffice",
    nationalResearchLab: "buyNationalResearchLab",
    nationalWarMemorial: "buyNationalWarMemorial",
    nuclearPowerPlant: "buyNuclearPowerPlant",
    pentagon: "buyPentagon",
    politicalLobbyist: "buyPoliticalLobbyist",
    scientificDevelopmentCenter: "buyScientificDevelopmentCenter",
    socialSecuritySystem: "buySocialSecuritySystem",
    spaceProgram: "buySpaceProgram",
    stockMarket: "buyStockMarket",
    strategicDefenseInitiative: "buyStrategicDefenseInitiative",
    superiorLogisticalSupport: "buySuperiorLogisticalSupport",
    universalHealthCare: "buyUniversalHealthCare",
    weaponsResearchCenter: "buyWeaponsResearchCenter",
  };

  const wonderParameters: { [key: string]: { Cost: string; Benefits: string; Requirements: string } } = {
    agricultureDevelopmentProgram: {
      Cost: "30,000,000 Warbucks",
      Benefits: "Increases land size by 15%, Increases citizen income +$2.00, Increases citizen-bonus per infrastructure from 8 to 9",
      Requirements: "3,000 land purchased, 500 technology"
    },
    airDefenseNetwork: {
      Cost: "50,000,000 Warbucks",
      Benefits: "Reduces damage from air attacks 40%",
      Requirements: ""
    },
    centralIntelligenceAgency: {
      Cost: "40,000,000 Warbucks",
      Benefits: "Increases supported spies +250, Increases spy attack strength +10%",
      Requirements: ""
    },
    disasterReliefAgency: {
      Cost: "40,000,000 Warbucks",
      Benefits: "Increases population +3%, Opens 3 extra foreign aid slots per 10 days",
      Requirements: ""
    },
    empWeaponization: {
      Cost: "200,000,000 Warbucks",
      Benefits: "Allows targeted EMP nuclear attacks for attackers with 5,000+ tech",
      Requirements: "5,000 technology, Weapons Research Complex"
    },
    falloutShelterSystem: {
      Cost: "40,000,000 Warbucks",
      Benefits: "50% soldiers survive nukes, Reduces losses from nuclear strike by 25%, Reduces anarchy by 1 day",
      Requirements: "6,000 infrastructure, 2,000 technology"
    },
    federalAidCommission: {
      Cost: "25,000,000 Warbucks",
      Benefits: "Raises cap on foreign money aid +50%",
      Requirements: ""
    },
    federalReserve: {
      Cost: "100,000,000 Warbucks",
      Benefits: "Allows +2 extra Banks to be purchased",
      Requirements: "Stock Market"
    },
    foreignAirForceBase: {
      Cost: "35,000,000 Warbucks",
      Benefits: "Raises aircraft limit +20",
      Requirements: ""
    },
    foreignArmyBase: {
      Cost: "200,000,000 Warbucks",
      Benefits: "Adds +1 offensive war slot",
      Requirements: "8,000 technology"
    },
    foreignNavalBase: {
      Cost: "200,000,000 Warbucks",
      Benefits: "Allows +2 naval vessels per day (+1 Peace Mode), Allows +1 naval deployment per day",
      Requirements: "20,000 infrastructure"
    },
    greatMonument: {
      Cost: "35,000,000 Warbucks",
      Benefits: "Increases happiness +4, Population always happy with government choice",
      Requirements: ""
    },
    greatTemple: {
      Cost: "35,000,000 Warbucks",
      Benefits: "Increases happiness +5, Population always happy with religion choice",
      Requirements: ""
    },
    greatUniversity: {
      Cost: "35,000,000 Warbucks",
      Benefits: "Decreases tech costs -10%, Increases happiness +2 per 1,000 tech (over 200 up to 3,000 tech)",
      Requirements: ""
    },
    hiddenNuclearMissileSilos: {
      Cost: "30,000,000 Warbucks",
      Benefits: "Allows +5 nuclear missiles immune to spy attacks",
      Requirements: ""
    },
    interCeptorMissileSystem: {
      Cost: "50,000,000 Warbucks",
      Benefits: "Reduces incoming cruise missile strike odds by 25%",
      Requirements: "5,000 technology, Strategic Defense Initiative"
    },
    internet: {
      Cost: "35,000,000 Warbucks",
      Benefits: "Increases population happiness +5",
      Requirements: ""
    },
    interstateSystem: {
      Cost: "45,000,000 Warbucks",
      Benefits: "Decreases infrastructure cost -8%, Decreases infrastructure upkeep -8%",
      Requirements: ""
    },
    manhattanProject: {
      Cost: "100,000,000 Warbucks",
      Benefits: "Allows nuclear weapon development under 150,000 strength, Cannot be destroyed",
      Requirements: "3,000 infrastructure, 300 technology, Uranium resource"
    },
    miningIndustryConsortium: {
      Cost: "25,000,000 Warbucks",
      Benefits: "Increases population income by +$2.00 for Coal, Lead, Oil, Uranium resources",
      Requirements: "5,000 infrastructure, 3,000 land, 1,000 technology"
    },
    movieIndustry: {
      Cost: "26,000,000 Warbucks",
      Benefits: "Increases population happiness +3",
      Requirements: ""
    },
    nationalCemetary: {
      Cost: "150,000,000 Warbucks",
      Benefits: "+1 Happiness per 5,000,000 soldier casualties (up to +5)",
      Requirements: "5 million soldier casualties, National War Memorial"
    },
    nationalEnvironmentalOffice: {
      Cost: "100,000,000 Warbucks",
      Benefits: "Removes penalties for Coal, Oil, Uranium; Improves environment +1; Increases population +3%; Reduces infrastructure upkeep -3%",
      Requirements: "13,000 infrastructure"
    },
    nationalResearchLab: {
      Cost: "35,000,000 Warbucks",
      Benefits: "Increases population +5%, Reduces technology costs -3%",
      Requirements: ""
    },
    nationalWarMemorial: {
      Cost: "27,000,000 Warbucks",
      Benefits: "Increases population happiness +4",
      Requirements: "50,000 casualties"
    },
    nuclearPowerPlant: {
      Cost: "75,000,000 Warbucks",
      Benefits: "+3 happiness with Uranium trade (+1 per 10 tech up to 40 tech), Reduces infra upkeep -5%, Reduces wonder upkeep -5%, Reduces improvement upkeep -5%",
      Requirements: "12,000 infrastructure, 1,000 technology, Uranium resource"
    },
    pentagon: {
      Cost: "30,000,000 Warbucks",
      Benefits: "Increases attacking and defending ground strength +20%",
      Requirements: ""
    },
    politicalLobbyist: {
      Cost: "50,000,000 Warbucks",
      Benefits: "Your vote counts as two votes in team's senate",
      Requirements: ""
    },
    scientificDevelopmentCenter: {
      Cost: "150,000,000 Warbucks",
      Benefits: "Improves factory infra cost -10%, Improves university citizen income +10%, Great University tech happiness bonus up to 5,000 tech",
      Requirements: "14,000 infrastructure, 3,000 technology, Great University, National Research Lab"
    },
    socialSecuritySystem: {
      Cost: "40,000,000 Warbucks",
      Benefits: "Allows tax rates up to 30% without additional happiness penalty",
      Requirements: ""
    },
    spaceProgram: {
      Cost: "30,000,000 Warbucks",
      Benefits: "Increases happiness +3, Reduces tech cost -3%, Reduces aircraft cost -5%",
      Requirements: ""
    },
    stockMarket: {
      Cost: "30,000,000 Warbucks",
      Benefits: "Increases citizen income +$10.00",
      Requirements: ""
    },
    strategicDefenseInitiative: {
      Cost: "75,000,000 Warbucks",
      Benefits: "Reduces odds of successful nuclear attack by 60%, Requires satellites and missile defenses",
      Requirements: "3 satellites and 3 missile defenses maintained"
    },
    superiorLogisticalSupport: {
      Cost: "80,000,000 Warbucks",
      Benefits: "Reduces aircraft and naval upkeep -10%, Reduces tank upkeep -5%, Increases ground battle strength +10%",
      Requirements: "Pentagon"
    },
    universalHealthCare: {
      Cost: "100,000,000 Warbucks",
      Benefits: "Increases population +3%, Increases population happiness +2",
      Requirements: "11,000 infrastructure, Hospital, National Research Lab"
    },
    weaponsResearchCenter: {
      Cost: "150,000,000 Warbucks",
      Benefits: "Allows 2 nukes per day, Hurts environment +1, Increases military purchase cost 0.01% per tech level",
      Requirements: "8,500 infrastructure, 2,000 technology, National Research Lab, Pentagon"
    }
  };

  const [wonderDetails, setWonderDetails] = useState<{ [key: string]: any }>({});

  const handleBuyWonder = async (key: keyof typeof wonderKeyMapping) => {
    const wonderKey = wonderKeyMapping[key];
    if (!walletAddress || !nationId || !wonderKey || !contractsData) return;

    const wonderContracts = [
      contractsData.WondersContract1,
      contractsData.WondersContract2,
      contractsData.WondersContract3,
      contractsData.WondersContract4,
    ];

    const wonderMappings = [
      [
        "buyAgriculturalDevelopmentProgram",
        "buyAirDefenseNetwork",
        "buyCentralIntelligenceAgency",
        "buyDisasterReliefAgency",
        "buyEmpWeaponization",
        "buyFalloutShelterSystem",
        "buyFederalAidCommission",
        "buyFederalReserve",
        "buyForeignAirForceBase",
        "buyForeignArmyBase",
        "buyForeignNavalBase",
      ],
      [
        "buyGreatMonument",
        "buyGreatTemple",
        "buyGreatUniversity",
        "buyHiddenNuclearMissileSilo",
        "buyInterceptorMissileSystem",
        "buyInternet",
        "buyInterstateSystem",
        "buyManhattanProject",
        "buyMiningIndustryConsortium",
      ],
      [
        "buyMovieIndustry",
        "buyNationalCemetary",
        "buyNationalEnvironmentalOffice",
        "buyNationalResearchLab",
        "buyNationalWarMemorial",
        "buyNuclearPowerPlant",
        "buyPentagon",
        "buyPoliticalLobbyist",
        "buyScientificDevelopmentCenter",
      ],
      [
        "buySocialSecuritySystem",
        "buySpaceProgram",
        "buyStockMarket",
        "buyStrategicDefenseInitiative",
        "buySuperiorLogisticalSupport",
        "buyUniversalHealthCare",
        "buyWeaponsResearchCenter",
      ],
    ];

    let found = null;
    let contractIndex = -1;
    let wonderIndex = -1;

    for (let i = 0; i < wonderMappings.length; i++) {
      const index = wonderMappings[i].indexOf(wonderKey);
      if (index !== -1) {
        found = wonderContracts[i];
        contractIndex = i + 1;
        wonderIndex = index + 1;
        break;
      }
    }

    if (!found || contractIndex === -1 || wonderIndex === -1) {
      alert("Wonder function not found in contracts");
      return;
    }

    try {
      const { request } = await simulateContract(wagmiConfig, {
        abi: found.abi,
        address: found.address,
        functionName: `buyWonder${contractIndex}`,
        args: [nationId, wonderIndex],
        account: walletAddress,
      });

      const tx = await writeContractAsync(request);
      alert("Wonder purchased successfully!");
      window.location.reload();
    } catch (err: any) {
      const message = parseRevertReason(err);
      console.error("Transaction error:", err);
      alert(message || "Transaction failed");
    }
  };

  const handleDeleteWonder = async (key: keyof typeof wonderKeyMapping) => {
    const wonderKey = wonderKeyMapping[key]?.replace("buy", "delete");
    if (!nationId || !contractsData || !publicClient || !writeContractAsync) return;

    try {
      await deleteWonder(
        nationId,
        wonderKey,
        publicClient,
        contractsData.WondersContract1,
        contractsData.WondersContract2,
        contractsData.WondersContract3,
        contractsData.WondersContract4,
        writeContractAsync
      );
      alert("Wonder deleted successfully!");
      window.location.reload();
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert(err.message || "Delete transaction failed");
    }
  };

  const fetchWonderDetails = async () => {
    if (!nationId || !contractsData || !publicClient) return;
    try {
      const wonders = await getWonders(
        nationId,
        contractsData.WondersContract1,
        contractsData.WondersContract2,
        contractsData.WondersContract3,
        contractsData.WondersContract4,
        publicClient
      );
      const balance = await checkBalance(nationId, publicClient, contractsData.TreasuryContract);

      const details: any = {
        warBucksBalance: (balance / BigInt(10 ** 18)).toLocaleString(),
      };
      if (wonders) {
        wonders.forEach(w => {
          const key = w.name.charAt(0).toLowerCase() + w.name.slice(1).replace(/\s+/g, "");
          details[key] = true;
        });
      }
      setWonderDetails(details);
    } catch (err) {
      console.error("Error fetching wonder details:", err);
    }
  };

  useEffect(() => {
    fetchWonderDetails();
  }, [nationId, contractsData, publicClient]);

  return (
    <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
      <h2 className="text-2xl font-bold text-primary-content text-center mb-4">🏛️ Wonder Details</h2>
      <div className="text-lg text-center font-semibold bg-base-200 p-3 rounded-lg shadow-md mb-6">
        Warbucks Balance: {wonderDetails["warBucksBalance"] || "0"}
      </div>
  
      {/* 👉 FIX: Wrap the table with Tooltip.Provider */}
      <Tooltip.Provider>
        <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
          <thead className="bg-primary text-primary-content">
            <tr>
              <th className="p-3 text-left">Wonder</th>
              <th className="p-3 text-left">Owned Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(wonderKeyMapping).map((key) => (
              <tr key={key} className="border-b border-neutral">
                <Tooltip.Root delayDuration={100}>
                  <Tooltip.Trigger asChild>
                    <td className="p-3 capitalize cursor-pointer">
                      {key.replace(/([A-Z])/g, " $1")}
                    </td>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      align="center"
                      className="bg-gray-800 text-white p-3 rounded-md text-sm shadow-lg max-w-xs break-words z-50"
                    >
                      <div><strong>Cost:</strong> {wonderParameters[key]?.Cost || "N/A"}</div>
                      <div><strong>Benefits:</strong> {wonderParameters[key]?.Benefits || "N/A"}</div>
                      <div><strong>Requirements:</strong> {wonderParameters[key]?.Requirements || "N/A"}</div>
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
  
                <td className="p-3">{wonderDetails[key] ? "Owned" : "Not Owned"}</td>
                <td className="p-3 flex space-x-2">
                  <button
                    onClick={() => handleBuyWonder(key as keyof typeof wonderKeyMapping)}
                    disabled={wonderDetails[key]}
                    className={`btn ${wonderDetails[key] ? "btn-disabled" : "btn-success"}`}
                  >
                    {wonderDetails[key] ? "Owned" : "Buy"}
                  </button>
                  {wonderDetails[key] && (
                    <button
                      onClick={() => handleDeleteWonder(key as keyof typeof wonderKeyMapping)}
                      className="btn btn-error"
                    >
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

export default BuyWonder;