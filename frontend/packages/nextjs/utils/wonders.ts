

export const getWonders = async (
    nationId: string,
    wondersContract1: any,
    wondersContract2: any,
    wondersContract3: any,
    wondersContract4: any,
    publicClient: any
) => {
    const wonders: { wonderCount: any; name: string }[] = [];

    if (!publicClient || !wondersContract1 || !wondersContract2 || !wondersContract3 || !wondersContract4 || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(wondersContract1, "wondersContract1")
        console.log(wondersContract2, "wondersContract2")
        console.log(wondersContract3, "wondersContract3")
        console.log(wondersContract4, "wondersContract4")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, wondersContract1, wondersContract2, wondersContract3, wondersContract4, or nationId.");
        return;
    }

    try {
        const wonderNames1 = [
            { key: "getAgriculturalDevelopmentProgram", name: "Agricultural Development Program" },
            { key: "getAntiAirDefenseNetwork", name: "Anti-Air Defense Network" },
            { key: "getCentralIntelligenceAgency", name: "Central Intelligence Agency" },
            { key: "getDisasterReliefAgency", name: "Disaster Relief Agency" },
            { key: "getEmpWeaponization", name: "EMP Weaponization" },
            { key: "getFalloutShelterSystem", name: "Fallout Shelter System" },
            { key: "getFederalAidComission", name: "Federal Aid Commission" },
            { key: "getFederalReserve", name: "Federal Reserve" },
            { key: "getForeignAirforceBase", name: "Foreign Air Force Base" },
            { key: "getForeignArmyBase", name: "Foreign Army Base" },
            { key: "getForeignNavalBase", name: "Foreign Navy Base" },
        ];

        for (const { key, name } of wonderNames1) {
            const wonderCount = await publicClient.readContract({
                abi: wondersContract1.abi,
                address: wondersContract1.address,
                functionName: key,
                args: [nationId],
            });

            if (wonderCount > 0) {
                wonders.push({ wonderCount, name });
            }
        }

        const wonderNames2 = [
            { key: "getGreatMonument", name: "Great Monument" },
            { key: "getGreatTemple", name: "Great Temple" },
            { key: "getGreatUniversity", name: "Great University" },
            { key: "getHiddenNuclearMissileSilo", name: "Hidden Nuclear Missile Silo" },
            { key: "getInterceptorMissileSystem", name: "Interceptor Missile System" },
            { key: "getInternet", name: "Internet" },
            { key: "getInterstateSystem", name: "Interstate System" },
            { key: "getManhattanProject", name: "Manhattan Project" },
            { key: "getMiningIndustryConsortium", name: "Mining Industry Consortium" },
        ]

        for (const { key, name } of wonderNames2) {
            const wonderCount = await publicClient.readContract({
                abi: wondersContract2.abi,
                address: wondersContract2.address,
                functionName: key,
                args: [nationId],
            });

            if (wonderCount > 0) {
                wonders.push({ wonderCount, name });
            }
        }

        const wonderNames3 = [
            { key: "getMovieIndustry", name: "Movie Industry" },
            { key: "getNationalCemetary", name: "National Cemetary" },
            { key: "getNationalEnvironmentOffice", name: "National Environmental Office" },
            { key: "getNationalResearchLab", name: "National Research Lab" },
            { key: "getNationalWarMemorial", name: "National War Memorial" },
            { key: "getNuclearPowerPlant", name: "Nuclear Power Plant" },
            { key: "getPentagon", name: "Pentagon" },
            { key: "getPoliticalLobbyists", name: "Political Lobbyists" },
            { key: "getScientificDevelopmentCenter", name: "Scientific Development Center" },
        ]

        for (const { key, name } of wonderNames3) {
            const wonderCount = await publicClient.readContract({
                abi: wondersContract3.abi,
                address: wondersContract3.address,
                functionName: key,
                args: [nationId],
            });

            if (wonderCount > 0) {
                wonders.push({ wonderCount, name });
            }
        }

        const wonderNames4 = [
            { key: "getSocialSecuritySystem", name: "Social Security System" },
            { key: "getSpaceProgram", name: "Space Program" },
            { key: "getStockMarket", name: "Stock Market" },
            { key: "getStrategicDefenseInitiative", name: "Strategic Defense Initiative" },
            { key: "getSuperiorLogisticalSupport", name: "Superior Logistical Support" },
            { key: "getUniversalHealthcare", name: "Universal Healthcare" },
            { key: "getWeaponsResearchCenter", name: "Weapons Research Center" },
        ]

        for (const { key, name } of wonderNames4) {
            const wonderCount = await publicClient.readContract({
                abi: wondersContract4.abi,
                address: wondersContract4.address,
                functionName: key,
                args: [nationId],
            });

            if (wonderCount > 0) {
                wonders.push({ wonderCount, name });
            }
        }

        return wonders;

    } catch (error) {
        console.error("An error occurred while fetching wonders:", error);
    }
}

export const buyWonder = async (
    nationId: string, 
    wonderKey: string, 
    publicClient: any, 
    wondersContract1: any, 
    wondersContract2: any, 
    wondersContract3: any, 
    wondersContract4: any, 
    writeContractAsync: any
) => {
    if (!publicClient || !wondersContract1 || !wondersContract2 || !wondersContract3 || !wondersContract4 || !nationId) {
        console.error("Missing required data: publicClient, wondersContract1, wondersContract2, wondersContract3, wondersContract4, or nationId.");
        return;
    }

    console.log(wonderKey, "wonderKey");

    try {
        const wonderMappings = {
            wondersContract1: [
                "buyAgriculturalDevelopmentProgram",
                "buyAntiAirDefenseNetwork",
                "buyCentralIntelligenceAgency",
                "buyDisasterReliefAgency",
                "buyEmpWeaponization",
                "buyFalloutShelterSystem",
                "buyFederalAidCommission",
                "buyFederalReserve",
                "buyForeignAirforceBase",
                "buyForeignArmyBase",
                "buyForeignNavalBase"
            ],
            wondersContract2: [
                "buyGreatMonument",
                "buyGreatTemple",
                "buyGreatUniversity",
                "buyHiddenNuclearMissileSilo",
                "buyInterceptorMissileSystem",
                "buyInternet",
                "buyInterstateSystem",
                "buyManhattanProject",
                "buyMiningIndustryConsortium"
            ],
            wondersContract3: [
                "buyMovieIndustry",
                "buyNationalCemetery",
                "buyNationalEnvironmentalOffice",
                "buyNationalResearchLab",
                "buyNationalWarMemorial",
                "buyNuclearPowerPlant",
                "buyPentagon",
                "buyPoliticalLobbyists",
                "buyScientificDevelopmentCenter"
            ],
            wondersContract4: [
                "buySocialSecuritySystem",
                "buySpaceProgram",
                "buyStockMarket",
                "buyStrategicDefenseInitiative",
                "buySuperiorLogisticalSupport",
                "buyUniversalHealthcare",
                "buyWeaponsResearchCenter"
            ]
        };

        for (const [contractKey, wonderKeys] of Object.entries(wonderMappings)) {
            const contract = eval(contractKey);
            const contractNumber = contractKey.charAt(contractKey.length - 1); // Extracting the contract number

            const index = wonderKeys.indexOf(wonderKey);

            if (index !== -1) {
                await writeContractAsync({
                    abi: contract.abi,
                    address: contract.address,
                    functionName: `buyWonder${contractNumber}`, // Adjusted function name based on contract number
                    args: [nationId, index + 1] // Index + 1 for 1-based indexing
                });
                return;
            }
        }

        console.error("Wonder key not recognized.");
    } catch (error) {
        console.error("Error buying wonder:", error);
    }
};



// { key: "getGreatPyramidCount", name: "Great Pyramids" },
// { key: "getHangingGardensCount", name: "Hanging Gardens" },
// { key: "getColossusCount", name: "Colossi" },
// { key: "getLighthouseCount", name: "Lighthouses" },
// { key: "getTempleOfArtemisCount", name: "Temples of Artemis" },
// { key: "getMausoleumCount", name: "Mausoleums" },
// { key: "getStatueOfZeusCount", name: "Statues of Zeus" },
// { key: "getHangingGardensCount", name: "Hanging Gardens" },
// { key: "getColossusCount", name: "Colossi" },
// { key: "getLighthouseCount", name: "Lighthouses" },
// { key: "getTempleOfArtemisCount", name: "Temples of Artemis" },
// { key: "getMausoleumCount", name: "Mausoleums" },
// { key: "getStatueOfZeusCount", name: "Statues of Zeus" },
// { key: "getHangingGardensCount", name: "Hanging Gardens" },


export const deleteWonder = async (
    nationId: string, 
    wonderKey: string, 
    publicClient: any, 
    wondersContract1: any, 
    wondersContract2: any, 
    wondersContract3: any, 
    wondersContract4: any, 
    writeContractAsync: any
) => {
    if (!publicClient || !wondersContract1 || !wondersContract2 || !wondersContract3 || !wondersContract4 || !nationId) {
        console.error("Missing required data: publicClient, wondersContract1, wondersContract2, wondersContract3, wondersContract4, or nationId.");
        return;
    }

    console.log(wonderKey, "wonderKey");

    try {
        const wonderMappings = {
            wondersContract1: [
                "deleteAgriculturalDevelopmentProgram",
                "deleteAntiAirDefenseNetwork",
                "deleteCentralIntelligenceAgency",
                "deleteDisasterReliefAgency",
                "deleteEmpWeaponization",
                "deleteFalloutShelterSystem",
                "deleteFederalAidCommission",
                "deleteFederalReserve",
                "deleteForeignAirforceBase",
                "deleteForeignArmyBase",
                "deleteForeignNavalBase"
            ],
            wondersContract2: [
                "deleteGreatMonument",
                "deleteGreatTemple",
                "deleteGreatUniversity",
                "deleteHiddenNuclearMissileSilo",
                "deleteInterceptorMissileSystem",
                "deleteInternet",
                "deleteInterstateSystem",
                "deleteManhattanProject",
                "deleteMiningIndustryConsortium"
            ],
            wondersContract3: [
                "deleteMovieIndustry",
                "deleteNationalCemetery",
                "deleteNationalEnvironmentalOffice",
                "deleteNationalResearchLab",
                "deleteNationalWarMemorial",
                "deleteNuclearPowerPlant",
                "deletePentagon",
                "deletePoliticalLobbyists",
                "deleteScientificDevelopmentCenter"
            ],
            wondersContract4: [
                "deleteSocialSecuritySystem",
                "deleteSpaceProgram",
                "deleteStockMarket",
                "deleteStrategicDefenseInitiative",
                "deleteSuperiorLogisticalSupport",
                "deleteUniversalHealthcare",
                "deleteWeaponsResearchCenter"
            ]
        };

        for (const [contractKey, wonderKeys] of Object.entries(wonderMappings)) {
            const contract = eval(contractKey);
            const contractNumber = contractKey.charAt(contractKey.length - 1); // Extracting the contract number

            const index = wonderKeys.indexOf(wonderKey);

            if (index !== -1) {
                await writeContractAsync({
                    abi: contract.abi,
                    address: contract.address,
                    functionName: `deleteWonder${contractNumber}`, // Adjusted function name based on contract number
                    args: [nationId, index + 1] // Index + 1 for 1-based indexing
                });
                return;
            }
        }

        console.error("Wonder key not recognized.");
    } catch (error) {
        console.error("Error deleting wonder:", error);
    }
};
