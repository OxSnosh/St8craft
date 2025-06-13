//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
// import { network, artifacts } from "hardhat"
// import { HardhatRuntimeEnvironment } from "hardhat/types";
// import { DeployFunction } from "hardhat-deploy/types";
// import { ContractFactory, JsonRpcProvider, parseEther } from "ethers";
// import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { networkConfig } from "../helper-hardhat-config";
import { VRFCoordinatorV2Mock } from "../typechain-types";
import { JsonRpcProvider, Wallet } from "ethers";

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, ethers } = hre as any;
    const { deploy } = deployments;
    let { deployer } = await getNamedAccounts();
    
    let chainId = network.config.chainId

    let subscriptionId    
    let vrfCoordinatorV2Mock
    let vrfCoordinatorV2Address 
    let gasLane
    let callbackGasLimit   

    const FUND_AMOUNT = ethers.parseEther("1")

    let provider

    let signer

    if (chainId == 31337) {

      const signers = await ethers.getSigners();

      const signer1 = signers[1] as unknown as HardhatEthersSigner;

      console.log("Signer1 address:", signer1.address);

      // const provider = new JsonRpcProvider("http://127.0.0.1:8545");
      // deployer = new Wallet(process.env.PRIVATE_KEY!, provider);

      // console.log("Deployer address NOW:", deployer.address);

        // const tx = await deployer.sendTransaction({
        //   to: deployer,
        //   value: ethers.parseEther("5.0"), // 5 ETH
        // });
    
        // await tx.wait();
        // console.log(`✅ Sent 5 ETH from deployer to  (${deployer.address}) on localhost`);

        const BASE_FEE = "250000000000000000" // 0.25 is this the premium in LINK?
        const GAS_PRICE_LINK = 1e9 // link per gas, is this the gas lane? // 0.000000001 LINK per gas
        // create VRFV2 Subscription
        await deploy("VRFCoordinatorV2Mock", {
          from: deployer,
          args: [BASE_FEE, GAS_PRICE_LINK],
          log: true,
        });
        const { address } = await deployments.get("VRFCoordinatorV2Mock");
        console.log("VRFCoordinatorV2Mock address:", address);
        signer = await ethers.getSigner(deployer) as HardhatEthersSigner;
        vrfCoordinatorV2Mock = await ethers.getContractAt(
          "VRFCoordinatorV2Mock",
          address,
          signer
        ) as VRFCoordinatorV2Mock
        // console.log("VRFCoordinatorV2Mock contract:", vrfCoordinatorV2Mock);
        vrfCoordinatorV2Address = address;
        console.log("VRFCoordinatorV2Mock deployed at:", vrfCoordinatorV2Address);
        // vrfCoordinatorV2Address = await vrfCoordinatorV2Mock.address
        // console.log("VRFCoordinatorV2Mock deployed at:", await vrfCoordinatorV2Address)
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        subscriptionId = 1
        gasLane = networkConfig[31337]["gasLane"]
        callbackGasLimit =  networkConfig[31337]["callbackGasLimit"] 
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)

        console.log("subscription funded")


    } else if (chainId == 84532) {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
        gasLane = networkConfig[chainId]["gasLane"]
        callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]

        signer = await ethers.getSigner(deployer) as HardhatEthersSigner;

        provider = new JsonRpcProvider("https://sepolia.base.org");

        console.log("base_sepolia")

    }

    const INITIAL_SUPPLY_ST8CRAFT = ethers.parseEther("200000000"); 
    const INITIAL_SUPPLY_WARBUCKS = ethers.parseEther("200000000000"); 

    console.log("Deploying contracts with the account:", deployer);

        const warBucks = await deploy("WarBucks", {
          from: deployer,
          args: [INITIAL_SUPPLY_WARBUCKS],
          log: true,
        })
        const deployedWarBucks = await ethers.getContractAt("WarBucks", warBucks.address, signer);

          // Deploy St8craftGovToken
        const st8craftGovToken = await deploy("St8craftGovToken", {
          from: deployer,
          args: [INITIAL_SUPPLY_ST8CRAFT],
          log: true,
        });
        const deployedSt8craftGovToken = await ethers.getContractAt("St8craftGovToken", st8craftGovToken.address, signer);

        // Deploy AidContract
        const aidContract = await deploy("AidContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedAidContract = await ethers.getContractAt("AidContract", aidContract.address, signer);

        // Deploy AirBattleContract
        const airBattleContract = await deploy("AirBattleContract", {
          from: deployer,
          args: [vrfCoordinatorV2Address, BigInt(subscriptionId), gasLane, callbackGasLimit],
          log: true,
        });
        const deployedAirBattleContract = await ethers.getContractAt("AirBattleContract", airBattleContract.address, signer);

        const additionalAirBattle = await deploy("AdditionalAirBattle", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedAdditionalAirBattle = await ethers.getContractAt("AdditionalAirBattle", additionalAirBattle.address, signer);
      
        const billsContract = await deploy("BillsContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedBillsContract = await ethers.getContractAt("BillsContract", billsContract.address, signer);
      
        const bombersContract = await deploy("BombersContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedBombersContract = await ethers.getContractAt("BombersContract", bombersContract.address, signer);
      
        const bombersMarketplace1 = await deploy("BombersMarketplace1", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedBombersMarketplace1 = await ethers.getContractAt("BombersMarketplace1", bombersMarketplace1.address, signer);
      
        const bombersMarketplace2 = await deploy("BombersMarketplace2", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedBombersMarketplace2 = await ethers.getContractAt("BombersMarketplace2", bombersMarketplace2.address, signer);
      
        const countryMinter = await deploy("CountryMinter", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedCountryMinter = await ethers.getContractAt("CountryMinter", countryMinter.address, signer);
      
        const countryParametersContract = await deploy("CountryParametersContract", {
          from: deployer,
          args: [vrfCoordinatorV2Address, BigInt(subscriptionId), gasLane, callbackGasLimit],
          log: true,
        });
        const deployedCountryParametersContract = await ethers.getContractAt("CountryParametersContract", countryParametersContract.address, signer);
      
        const allianceManager = await deploy("AllianceManager", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedAllianceManager = await ethers.getContractAt("AllianceManager", allianceManager.address, signer);
      
        const crimeContract = await deploy("CrimeContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedCrimeContract = await ethers.getContractAt("CrimeContract", crimeContract.address, signer);
      
        const cruiseMissileContract = await deploy("CruiseMissileContract", {
          from: deployer,
          args: [vrfCoordinatorV2Address, BigInt(subscriptionId), gasLane, callbackGasLimit],
          log: true,
        });
        const deployedCruiseMissileContract = await ethers.getContractAt("CruiseMissileContract", cruiseMissileContract.address, signer);
      
        const environmentContract = await deploy("EnvironmentContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedEnvironmentContract = await ethers.getContractAt("EnvironmentContract", environmentContract.address, signer);
      
        const fightersContract = await deploy("FightersContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedFightersContract = await ethers.getContractAt("FightersContract", fightersContract.address, signer);
      
        const fighterLosses = await deploy("FighterLosses", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedFighterLosses = await ethers.getContractAt("FighterLosses", fighterLosses.address, signer);
      
        const fightersMarketplace1 = await deploy("FightersMarketplace1", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedFightersMarketplace1 = await ethers.getContractAt("FightersMarketplace1", fightersMarketplace1.address, signer);
      
        const fightersMarketplace2 = await deploy("FightersMarketplace2", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedFightersMarketplace2 = await ethers.getContractAt("FightersMarketplace2", fightersMarketplace2.address, signer);
      
        const forcesContract = await deploy("ForcesContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedForcesContract = await ethers.getContractAt("ForcesContract", forcesContract.address, signer);
      
        const spyContract = await deploy("SpyContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedSpyContract = await ethers.getContractAt("SpyContract", spyContract.address, signer);
      
        const missilesContract = await deploy("MissilesContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedMissilesContract = await ethers.getContractAt("MissilesContract", missilesContract.address, signer);
      
        const groundBattleContract = await deploy("GroundBattleContract", {
          from: deployer,
          args: [vrfCoordinatorV2Address, BigInt(subscriptionId), gasLane, callbackGasLimit],
          log: true,
        });
        const deployedGroundBattleContract = await ethers.getContractAt("GroundBattleContract", groundBattleContract.address, signer);
      
        const improvementsContract1 = await deploy("ImprovementsContract1", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedImprovementsContract1 = await ethers.getContractAt("ImprovementsContract1", improvementsContract1.address, signer);
      
        const improvementsContract2 = await deploy("ImprovementsContract2", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedImprovementsContract2 = await ethers.getContractAt("ImprovementsContract2", improvementsContract2.address, signer);
      
        const improvementsContract3 = await deploy("ImprovementsContract3", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedImprovementsContract3 = await ethers.getContractAt("ImprovementsContract3", improvementsContract3.address, signer);
      
        const improvementsContract4 = await deploy("ImprovementsContract4", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedImprovementsContract4 = await ethers.getContractAt("ImprovementsContract4", improvementsContract4.address, signer);
      
        const infrastructureContract = await deploy("InfrastructureContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedInfrastructureContract = await ethers.getContractAt("InfrastructureContract", infrastructureContract.address, signer);
      
        const infrastructureMarketContract = await deploy("InfrastructureMarketContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedInfrastructureMarketContract = await ethers.getContractAt("InfrastructureMarketContract", infrastructureMarketContract.address, signer);
      
        const keeperContract = await deploy("KeeperContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedKeeperContract = await ethers.getContractAt("KeeperContract", keeperContract.address, signer);
      
        const landMarketContract = await deploy("LandMarketContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedLandMarketContract = await ethers.getContractAt("LandMarketContract", landMarketContract.address, signer);
      
        const militaryContract = await deploy("MilitaryContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedMilitaryContract = await ethers.getContractAt("MilitaryContract", militaryContract.address, signer);
      
        const nationStrengthContract = await deploy("NationStrengthContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedNationStrengthContract = await ethers.getContractAt("NationStrengthContract", nationStrengthContract.address, signer);
      
        const navyContract = await deploy("NavyContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedNavyContract = await ethers.getContractAt("NavyContract", navyContract.address, signer);
      
        const navyContract2 = await deploy("NavyContract2", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedNavyContract2 = await ethers.getContractAt("NavyContract2", navyContract2.address, signer);
      
        const additionalNavyContract = await deploy("AdditionalNavyContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedAdditionalNavyContract = await ethers.getContractAt("AdditionalNavyContract", additionalNavyContract.address, signer);
      
        const navalActionsContract = await deploy("NavalActionsContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedNavalActionsContract = await ethers.getContractAt("NavalActionsContract", navalActionsContract.address, signer);
      
        const navalBlockadeContract = await deploy("NavalBlockadeContract", {
          from: deployer,
          args: [vrfCoordinatorV2Address, BigInt(subscriptionId), gasLane, callbackGasLimit],
          log: true,
        });
        const deployedNavalBlockadeContract = await ethers.getContractAt("NavalBlockadeContract", navalBlockadeContract.address, signer);
      
        const breakBlocadeContract = await deploy("BreakBlocadeContract", {
          from: deployer,
          args: [vrfCoordinatorV2Address, BigInt(subscriptionId), gasLane, callbackGasLimit],
          log: true,
        });
        const deployedBreakBlocadeContract = await ethers.getContractAt("BreakBlocadeContract", breakBlocadeContract.address, signer);
      
        const navalAttackContract = await deploy("NavalAttackContract", {
          from: deployer,
          args: [vrfCoordinatorV2Address, BigInt(subscriptionId), gasLane, callbackGasLimit],
          log: true,
        });
        const deployedNavalAttackContract = await ethers.getContractAt("NavalAttackContract", navalAttackContract.address, signer);
      
        const nukeContract = await deploy("NukeContract", {
          from: deployer,
          args: [vrfCoordinatorV2Address, BigInt(subscriptionId), gasLane, callbackGasLimit],
          log: true,
        });
        const deployedNukeContract = await ethers.getContractAt("NukeContract", nukeContract.address, signer);
      
        const resourcesContract = await deploy("ResourcesContract", {
          from: deployer,
          args: [vrfCoordinatorV2Address, BigInt(subscriptionId), gasLane, callbackGasLimit],
          log: true,
        });
        const deployedResourcesContract = await ethers.getContractAt("ResourcesContract", resourcesContract.address, signer);
      
        const bonusResourcesContract = await deploy("BonusResourcesContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedBonusResourcesContract = await ethers.getContractAt("BonusResourcesContract", bonusResourcesContract.address, signer);
      
        const senateContract = await deploy("SenateContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedSenateContract = await ethers.getContractAt("SenateContract", senateContract.address, signer);
      
        const spyOperationsContract = await deploy("SpyOperationsContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedSpyOperationsContract = await ethers.getContractAt("SpyOperationsContract", spyOperationsContract.address, signer);  
      
        const taxesContract = await deploy("TaxesContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedTaxesContract = await ethers.getContractAt("TaxesContract", taxesContract.address, signer);
      
        const additionalTaxesContract = await deploy("AdditionalTaxesContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedAdditionalTaxesContract = await ethers.getContractAt("AdditionalTaxesContract", additionalTaxesContract.address, signer);
      
        const technologyMarketContract = await deploy("TechnologyMarketContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedTechnologyMarketContract = await ethers.getContractAt("TechnologyMarketContract", technologyMarketContract.address, signer);
      
        const treasuryContract = await deploy("TreasuryContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedTreasuryContract = await ethers.getContractAt("TreasuryContract", treasuryContract.address, signer);
      
        const warContract = await deploy("WarContract", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedWarContract = await ethers.getContractAt("WarContract", warContract.address, signer);
      
        const wondersContract1 = await deploy("WondersContract1", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedWondersContract1 = await ethers.getContractAt("WondersContract1", wondersContract1.address, signer);
      
        const wondersContract2 = await deploy("WondersContract2", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedWondersContract2 = await ethers.getContractAt("WondersContract2", wondersContract2.address, signer);
      
        const wondersContract3 = await deploy("WondersContract3", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedWondersContract3 = await ethers.getContractAt("WondersContract3", wondersContract3.address, signer);
      
        const wondersContract4 = await deploy("WondersContract4", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedWondersContract4 = await ethers.getContractAt("WondersContract4", wondersContract4.address, signer);
      
        const messenger = await deploy("Messenger", {
          from: deployer,
          args: [],
          log: true,
        });
        const deployedMessenger = await ethers.getContractAt("Messenger", messenger.address, signer);

        await deployedWarBucks.settings(
            treasuryContract.address,
            countryMinter.address,
        )

        console.log("warbucks settings");

        await deployedAidContract.settings(
            countryMinter.address,
            treasuryContract.address,
            forcesContract.address,
            infrastructureContract.address,
            keeperContract.address,
            wondersContract1.address,
            senateContract.address,
            countryParametersContract.address
          );                  
       
        console.log("aid contract settings");

        await deployedAirBattleContract.settings(
            warContract.address,
            fightersContract.address,
            bombersContract.address,
            infrastructureContract.address,
            forcesContract.address,
            fighterLosses.address,
            countryMinter.address,
            additionalAirBattle.address
          );          

        console.log("air battle contract settings");

        await deployedAdditionalAirBattle.settings(
            warContract.address,
            fightersContract.address,
            bombersContract.address,
            infrastructureContract.address,
            forcesContract.address,
            fighterLosses.address,
            countryMinter.address,
            airBattleContract.address
          );

        console.log("additional air battle contract settings");

        await deployedBillsContract.settings(
            countryMinter.address,
            treasuryContract.address,
            wondersContract1.address,
            wondersContract2.address,
            wondersContract3.address,
            wondersContract4.address,
            forcesContract.address,
            fightersContract.address,
            navyContract.address,
            resourcesContract.address
          );
          
          await deployedBillsContract.settings2(
            improvementsContract1.address,
            improvementsContract2.address,
            missilesContract.address,
            wondersContract4.address,
            infrastructureContract.address,
            bonusResourcesContract.address,
            navyContract2.address,
            countryParametersContract.address,
            navalBlockadeContract.address
          );
          

        console.log("bills contract settings");
        
        await deployedBombersContract.settings(
            countryMinter.address,
            bombersMarketplace1.address,
            bombersMarketplace2.address,
            airBattleContract.address,
            treasuryContract.address,
            fightersContract.address,
            infrastructureContract.address,
            warContract.address
          );

        console.log("bombers contract settings");

        await deployedBombersMarketplace1.settings(
            countryMinter.address,
            bombersContract.address,
            fightersContract.address,
            fightersMarketplace1.address,
            infrastructureContract.address,
            treasuryContract.address
          );

        console.log("bombers marketplace 1 settings");

        await deployedBombersMarketplace2.settings(
            countryMinter.address,
            bombersContract.address,
            fightersContract.address,
            fightersMarketplace1.address,
            infrastructureContract.address,
            treasuryContract.address
          );
        
        console.log("bombers marketplace 2 settings");
        
        await deployedCountryMinter.settings(
            countryParametersContract.address,
            treasuryContract.address,
            infrastructureContract.address,
            resourcesContract.address,
            missilesContract.address,
            senateContract.address,
            warBucks.address,
            bonusResourcesContract.address
          );
          
          await deployedCountryMinter.settings2(
            improvementsContract1.address,
            improvementsContract2.address,
            improvementsContract3.address,
            improvementsContract4.address,
            wondersContract1.address,
            wondersContract2.address,
            wondersContract3.address,
            wondersContract4.address
          );
          
          await deployedCountryMinter.settings3(
            militaryContract.address,
            forcesContract.address,
            navyContract.address,
            navyContract2.address,
            navalActionsContract.address,
            fightersContract.address,
            bombersContract.address
          );
        
        console.log("country minter settings");
        
        await deployedCountryParametersContract.settings(
            spyOperationsContract.address,
            countryMinter.address,
            senateContract.address,
            keeperContract.address,
            nukeContract.address,
            groundBattleContract.address,
            wondersContract1.address,
            treasuryContract.address
          );

        console.log("country parameters contract settings");

        await deployedAllianceManager.settings(
            countryMinter.address
          );

        console.log("alliance manager settings");

        await deployedCrimeContract.settings(
            infrastructureContract.address,
            improvementsContract1.address,
            improvementsContract2.address,
            improvementsContract3.address,
            improvementsContract4.address,
            countryParametersContract.address,
            wondersContract2.address
          );
        
        console.log("crime contract settings");
        
        await deployedCruiseMissileContract.settings(
            forcesContract.address,
            countryMinter.address,
            warContract.address,
            infrastructureContract.address,
            missilesContract.address
          );
          
          await deployedCruiseMissileContract.settings2(
            improvementsContract1.address,
            improvementsContract3.address,
            improvementsContract4.address,
            wondersContract2.address
          );
        
        console.log("cruise missile contract settings");

        await deployedEnvironmentContract.settings(
            countryMinter.address,
            resourcesContract.address,
            infrastructureContract.address,
            wondersContract3.address,
            wondersContract4.address,
            forcesContract.address,
            countryParametersContract.address,
            additionalTaxesContract.address,
            missilesContract.address,
            nukeContract.address
          );
          
          await deployedEnvironmentContract.settings2(
            improvementsContract1.address,
            improvementsContract3.address,
            improvementsContract4.address,
            bonusResourcesContract.address
          );

        console.log("environment contract settings");
        
        await deployedFightersContract.settings(
            countryMinter.address,
            fightersMarketplace1.address,
            fightersMarketplace2.address,
            treasuryContract.address,
            warContract.address,
            infrastructureContract.address,
            resourcesContract.address,
            improvementsContract1.address,
            airBattleContract.address,
            wondersContract1.address,
            fighterLosses.address
          );
          
          await deployedFightersContract.settings2(
            navyContract.address,
            bombersContract.address
          );
        
        console.log("fighters contract settings");
        
        await deployedFighterLosses.settings(
            fightersContract.address,
            airBattleContract.address
          );

        console.log("fighter losses settings");

        await deployedFightersMarketplace1.settings(
            countryMinter.address,
            bombersContract.address,
            fightersContract.address,
            treasuryContract.address,
            infrastructureContract.address,
            resourcesContract.address,
            improvementsContract1.address,
            wondersContract1.address,
            wondersContract4.address,
            navyContract.address
          );
          
          await deployedFightersMarketplace1.settings2(
            bonusResourcesContract.address,
            navyContract2.address
          );

        console.log("fighters marketplace 1 settings");
        
        await deployedFightersMarketplace2.settings(
            countryMinter.address,
            bombersContract.address,
            fightersContract.address,
            fightersMarketplace1.address,
            treasuryContract.address,
            infrastructureContract.address,
            resourcesContract.address,
            improvementsContract1.address
          );
        
        console.log("fighters marketplace 2 settings");
        
        await deployedForcesContract.settings(
            treasuryContract.address,
            aidContract.address,
            spyOperationsContract.address,
            cruiseMissileContract.address,
            nukeContract.address,
            airBattleContract.address,
            groundBattleContract.address,
            warContract.address
          );
          
          await deployedForcesContract.settings2(
            infrastructureContract.address,
            resourcesContract.address,
            improvementsContract1.address,
            improvementsContract2.address,
            wondersContract1.address,
            countryMinter.address,
            keeperContract.address,
            countryParametersContract.address
          );
        
        console.log("forces contract settings");
        
        await deployedMissilesContract.settings(
            treasuryContract.address,
            spyOperationsContract.address,
            nukeContract.address,
            airBattleContract.address,
            wondersContract2.address,
            nationStrengthContract.address,
            infrastructureContract.address
          );
          
          await deployedMissilesContract.settings2(
            resourcesContract.address,
            improvementsContract1.address,
            wondersContract1.address,
            wondersContract4.address,
            countryMinter.address,
            keeperContract.address
          );
        
        console.log("missiles contract settings");
            
        await deployedGroundBattleContract.settings(
            warContract.address,
            infrastructureContract.address,
            forcesContract.address,
            treasuryContract.address,
            countryMinter.address,
            militaryContract.address
          );
          
          await deployedGroundBattleContract.settings2(
            improvementsContract2.address,
            improvementsContract4.address,
            wondersContract3.address,
            wondersContract4.address,
            additionalTaxesContract.address,
            countryParametersContract.address
          );
        
        console.log("ground battle contract settings");
        
        await deployedImprovementsContract1.settings(
            treasuryContract.address,
            improvementsContract2.address,
            improvementsContract3.address,
            improvementsContract4.address,
            navyContract.address,
            additionalNavyContract.address,
            countryMinter.address,
            wondersContract1.address,
            infrastructureContract.address
          );
        
        console.log("improvements contract 1 settings");

        await deployedImprovementsContract2.settings(
            treasuryContract.address,
            forcesContract.address,
            wondersContract1.address,
            countryMinter.address,
            improvementsContract1.address,
            resourcesContract.address,
            spyContract.address
          );

        console.log("improvements contract 2 settings");
        
        await deployedImprovementsContract3.settings(
            treasuryContract.address,
            additionalNavyContract.address,
            improvementsContract1.address,
            improvementsContract2.address,
            countryMinter.address,
            bonusResourcesContract.address,
            wondersContract4.address
        );

        console.log("improvements contract 3 settings");
        
        await deployedImprovementsContract4.settings(
            treasuryContract.address,
            forcesContract.address,
            improvementsContract1.address,
            improvementsContract2.address,
            countryMinter.address,
            wondersContract4.address,
            resourcesContract.address
          );

        console.log("improvements contract 4 settings");
        
        await deployedInfrastructureContract.settings1(
            resourcesContract.address,
            improvementsContract1.address,
            improvementsContract2.address,
            improvementsContract3.address,
            improvementsContract4.address,
            infrastructureMarketContract.address,
            technologyMarketContract.address,
            landMarketContract.address,
            bonusResourcesContract.address
        );

        await deployedInfrastructureContract.settings2(
            wondersContract1.address,
            wondersContract2.address,
            wondersContract3.address,
            wondersContract4.address,
            treasuryContract.address,
            countryParametersContract.address,
            forcesContract.address,
            aidContract.address
        );

        await deployedInfrastructureContract.settings3(
            spyOperationsContract.address,
            taxesContract.address,
            cruiseMissileContract.address,
            nukeContract.address,
            airBattleContract.address,
            groundBattleContract.address,
            countryMinter.address,
            crimeContract.address,
            countryParametersContract.address
        );

        console.log("infrastructure contract settings");

        await deployedInfrastructureMarketContract.settings(
            resourcesContract.address,
            countryParametersContract.address,
            improvementsContract1.address,
            countryMinter.address,
            wondersContract2.address,
            wondersContract3.address,
            treasuryContract.address,
            infrastructureContract.address,
            bonusResourcesContract.address
          );

        console.log("infrastructure marketplace settings");

        await deployedLandMarketContract.settings(
            resourcesContract.address,
            countryMinter.address,
            infrastructureContract.address,
            treasuryContract.address
          );

        console.log("land market contract settings");

        await deployedMilitaryContract.settings(
            spyOperationsContract.address,
            countryMinter.address,
            keeperContract.address
          );

        console.log("military contract settings");

        await deployedNationStrengthContract.settings(
            infrastructureContract.address,
            forcesContract.address,
            fightersContract.address,
            bombersContract.address,
            navyContract.address,
            missilesContract.address,
            navyContract2.address
          );

        console.log("nation strength contract settings");

        await deployedNavyContract.settings(
            treasuryContract.address,
            improvementsContract1.address,
            improvementsContract3.address,
            improvementsContract4.address,
            resourcesContract.address,
            militaryContract.address,
            nukeContract.address,
            wondersContract1.address,
            navalActionsContract.address,
            additionalNavyContract.address
          );
          
          await deployedNavyContract.settings2(
            countryMinter.address,
            bonusResourcesContract.address,
            navyContract2.address,
            infrastructureContract.address
          );

        console.log("navy contract settings");

        await deployedNavyContract2.settings(
            treasuryContract.address,
            improvementsContract1.address,
            improvementsContract3.address,
            improvementsContract4.address,
            resourcesContract.address,
            militaryContract.address,
            nukeContract.address,
            wondersContract1.address,
            navalActionsContract.address,
            additionalNavyContract.address
          );
          
          await deployedNavyContract2.settings2(
            countryMinter.address,
            bonusResourcesContract.address,
            navyContract.address,
            infrastructureContract.address
          );

        console.log("navy contract 2 settings");

        await deployedNavalActionsContract.settings(
            navalBlockadeContract.address,
            breakBlocadeContract.address,
            navalAttackContract.address,
            keeperContract.address,
            navyContract.address,
            navyContract2.address,
            countryMinter.address
          );

        console.log("naval actions contract settings");

        await deployedAdditionalNavyContract.settings(
            navyContract.address,
            navalActionsContract.address,
            militaryContract.address,
            wondersContract1.address,
            improvementsContract4.address,
            navyContract2.address,
            navalBlockadeContract.address,
            breakBlocadeContract.address,
            navalAttackContract.address
          );

        console.log("additional navy contract settings");

        await deployedNavalBlockadeContract.settings(
            navyContract.address,
            additionalNavyContract.address,
            navalActionsContract.address,
            warContract.address,
            countryMinter.address,
            keeperContract.address,
            breakBlocadeContract.address,
            billsContract.address
          );

        console.log("naval blockade contract settings");

        await deployedBreakBlocadeContract.settings(
            countryMinter.address,
            navalBlockadeContract.address,
            navyContract.address,
            warContract.address,
            improvementsContract4.address,
            navalActionsContract.address,
            navyContract2.address,
            additionalNavyContract.address
          );

        console.log("break blockade contract settings");

        await deployedNavalAttackContract.settings(
            navyContract.address,
            warContract.address,
            improvementsContract4.address,
            navalActionsContract.address,
            navyContract2.address,
            additionalNavyContract.address,
            countryMinter.address
          );

        console.log("naval attack contract settings");

        await deployedNukeContract.settings(
            countryMinter.address,
            warContract.address,
            wondersContract1.address,
            wondersContract4.address,
            improvementsContract3.address,
            improvementsContract4.address,
            infrastructureContract.address,
            forcesContract.address,
            navyContract.address,
            missilesContract.address,
            keeperContract.address
          );
          
          await deployedNukeContract.settings2(
            countryParametersContract.address
          );

        console.log("nuke contract settings");

        await deployedResourcesContract.settings(
            infrastructureContract.address,
            improvementsContract2.address,
            countryMinter.address,
            bonusResourcesContract.address,
            senateContract.address,
            technologyMarketContract.address,
            countryParametersContract.address
          );
          
          await deployedBonusResourcesContract.settings(
            infrastructureContract.address,
            countryMinter.address,
            resourcesContract.address,
            crimeContract.address
          );

        console.log("resources contract settings");

        await deployedSenateContract.settings(
            countryMinter.address,
            countryParametersContract.address,
            wondersContract3.address,
            keeperContract.address,
            resourcesContract.address
          );

        console.log("senate contract settings");

        await deployedSpyContract.settings(
            spyOperationsContract.address,
            treasuryContract.address,
            countryMinter.address,
            improvementsContract2.address,
            wondersContract1.address
          );

        console.log("spy contract settings");

        await deployedSpyOperationsContract.settings(
            infrastructureContract.address,
            forcesContract.address,
            militaryContract.address,
            nationStrengthContract.address,
            wondersContract1.address,
            wondersContract2.address,
            treasuryContract.address,
            countryParametersContract.address,
            missilesContract.address,
            countryMinter.address
            );

        await deployedSpyOperationsContract.settings2(
            keeperContract.address,
            spyContract.address
            );

        console.log("spy operations contract settings");

        await deployedTaxesContract.settings1(
            countryMinter.address,
            infrastructureContract.address,
            treasuryContract.address,
            improvementsContract1.address,
            improvementsContract2.address,
            improvementsContract3.address,
            improvementsContract4.address,
            additionalTaxesContract.address,
            bonusResourcesContract.address,
            keeperContract.address,
            environmentContract.address
          );
          
          await deployedTaxesContract.settings2(
            countryParametersContract.address,
            wondersContract1.address,
            wondersContract2.address,
            wondersContract3.address,
            wondersContract4.address,
            resourcesContract.address,
            forcesContract.address,
            militaryContract.address,
            crimeContract.address,
            navalBlockadeContract.address
          );

        console.log("taxes contract settings");

        await deployedAdditionalTaxesContract.settings(
            countryParametersContract.address,
            wondersContract1.address,
            wondersContract2.address,
            wondersContract3.address,
            wondersContract4.address,
            resourcesContract.address,
            militaryContract.address,
            infrastructureContract.address,
            bonusResourcesContract.address
          );
          
          await deployedAdditionalTaxesContract.settings2(
            improvementsContract2.address,
            improvementsContract3.address,
            forcesContract.address
          );

        console.log("additional taxes contract settings");

        await deployedTechnologyMarketContract.settings(
            resourcesContract.address,
            improvementsContract3.address,
            infrastructureContract.address,
            wondersContract2.address,
            wondersContract3.address,
            wondersContract4.address,
            treasuryContract.address,
            countryMinter.address,
            bonusResourcesContract.address,
            crimeContract.address
          );

        console.log("technology market contract settings");

        await deployedTreasuryContract.settings1(
            warBucks.address,
            wondersContract1.address,
            wondersContract2.address,
            wondersContract3.address,
            wondersContract4.address,
            improvementsContract1.address,
            improvementsContract2.address,
            improvementsContract3.address,
            improvementsContract4.address,
            infrastructureContract.address
          );
          
          await deployedTreasuryContract.settings2(
            groundBattleContract.address,
            countryMinter.address,
            keeperContract.address,
            forcesContract.address,
            navyContract.address,
            fightersContract.address,
            bombersContract.address,
            aidContract.address,
            taxesContract.address,
            billsContract.address,
            spyOperationsContract.address
          );
          
          await deployedTreasuryContract.settings3(
            navyContract2.address,
            missilesContract.address,
            infrastructureMarketContract.address,
            landMarketContract.address,
            technologyMarketContract.address,
            fightersMarketplace1.address,
            fightersMarketplace2.address,
            bombersMarketplace1.address,
            bombersMarketplace2.address,
            countryParametersContract.address,
            spyContract.address
          );
          
        console.log("treasury contract settings");

        await deployedWarContract.settings(
            countryMinter.address,
            nationStrengthContract.address,
            militaryContract.address,
            breakBlocadeContract.address,
            navalAttackContract.address,
            airBattleContract.address,
            groundBattleContract.address,
            cruiseMissileContract.address,
            forcesContract.address,
            wondersContract1.address,
            keeperContract.address
          );
          
          await deployedWarContract.settings2(
            treasuryContract.address,
            forcesContract.address,
            navalBlockadeContract.address,
            nukeContract.address
          );

        console.log("war contract settings");

        await deployedWondersContract1.settings(
            treasuryContract.address,
            wondersContract2.address,
            wondersContract3.address,
            wondersContract4.address,
            infrastructureContract.address,
            countryMinter.address
          );

        console.log("wonders contract 1 settings");

        await deployedWondersContract2.settings(
            treasuryContract.address,
            infrastructureContract.address,
            wondersContract1.address,
            wondersContract3.address,
            wondersContract4.address,
            countryMinter.address,
            resourcesContract.address
          );

        console.log("wonders contract 2 settings");

        await deployedWondersContract3.settings(
            treasuryContract.address,
            infrastructureContract.address,
            forcesContract.address,
            wondersContract1.address,
            wondersContract2.address,
            wondersContract4.address,
            countryMinter.address,
            resourcesContract.address
          );

        console.log("wonders contract 3 settings");

        await deployedWondersContract4.settings(
            treasuryContract.address,
            improvementsContract2.address,
            improvementsContract3.address,
            improvementsContract4.address,
            infrastructureContract.address,
            wondersContract1.address,
            wondersContract3.address,
            countryMinter.address
          );
          

        console.log("wonders contract 4 settings");

        await deployedMessenger.settings(
            countryMinter.address
          );
    
        console.log("messenger settings");
    
        console.log("settings initiated");
    
        if(chainId == 31337 || chainId == 1337) {
            if (!vrfCoordinatorV2Mock) {
                throw new Error("vrfCoordinatorV2Mock is undefined.");
            }
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, resourcesContract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, countryParametersContract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, spyOperationsContract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, cruiseMissileContract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, nukeContract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, airBattleContract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, groundBattleContract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, navalAttackContract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, navalBlockadeContract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, breakBlocadeContract.address);
                
        }
    
      }
    
export default main

