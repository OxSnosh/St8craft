// //St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
// import { network, artifacts } from "hardhat"
// import { HardhatRuntimeEnvironment } from "hardhat/types";
// import { DeployFunction } from "hardhat-deploy/types";
// import { LedgerSigner } from "@ethers-ext/signer-ledger";
// import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";

// import { 
//     WarBucks, 
//     St8craftGovToken,
//     AidContract,
//     AirBattleContract,
//     AdditionalAirBattle,
//     BillsContract,
//     BombersContract,
//     BombersMarketplace1,
//     BombersMarketplace2,
//     CountryMinter,
//     CountryParametersContract,
//     AllianceManager,
//     CrimeContract,
//     CruiseMissileContract,
//     EnvironmentContract,
//     FightersContract,
//     FighterLosses,
//     FightersMarketplace1,
//     FightersMarketplace2,
//     ForcesContract,
//     MissilesContract,
//     GroundBattleContract,
//     ImprovementsContract1,
//     ImprovementsContract2,
//     ImprovementsContract3,
//     ImprovementsContract4,
//     InfrastructureContract,
//     InfrastructureMarketContract,
//     KeeperContract,
//     LandMarketContract,
//     MilitaryContract,
//     NationStrengthContract,
//     NavalActionsContract,
//     NavyContract,
//     NavyContract2,
//     AdditionalNavyContract,
//     NavalBlockadeContract,
//     BreakBlocadeContract,
//     NavalAttackContract,
//     NukeContract,
//     ResourcesContract,
//     SenateContract,
//     SpyContract,
//     SpyOperationsContract,
//     TaxesContract,
//     AdditionalTaxesContract,
//     TechnologyMarketContract,
//     TreasuryContract,
//     WarContract,
//     WondersContract1,
//     WondersContract2,
//     WondersContract3,
//     WondersContract4,
//     VRFConsumerBaseV2,
//     VRFCoordinatorV2Mock,
//     BonusResourcesContract,
//     Messenger
// } from "../typechain-types"
// import { networkConfig } from "../helper-hardhat-config"
// import fs from "fs"
// import deployedContracts from '../../frontend/packages/hardhat/deploy/99_generateTsAbis';


// const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//     const { deployments, getNamedAccounts, ethers } = hre as any;
//     const { deploy } = deployments;
//     let { deployer } = await getNamedAccounts();

//     let chainId = network.config.chainId
//     let subscriptionId    
//     let vrfCoordinatorV2Mock
//     let vrfCoordinatorV2Address 
//     let gasLane
//     let callbackGasLimit   

//     const FUND_AMOUNT = ethers.utils.parseEther("1")

//     let provider

//     if (chainId == 31337) {
//         const BASE_FEE = "250000000000000000" // 0.25 is this the premium in LINK?
//         const GAS_PRICE_LINK = 1e9 // link per gas, is this the gas lane? // 0.000000001 LINK per gas
//         // create VRFV2 Subscription
//         const VRFCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock")
//         vrfCoordinatorV2Mock = await VRFCoordinatorV2Mock.deploy(BASE_FEE, GAS_PRICE_LINK)
//         vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
//         const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
//         const transactionReceipt = await transactionResponse.wait()
//         subscriptionId = transactionReceipt.events[0].args.subId
//         gasLane = networkConfig[31337]["gasLane"]
//         callbackGasLimit =  networkConfig[31337]["callbackGasLimit"] 
//         await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
//     } else if (chainId == 84532) {
//         vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
//         subscriptionId = networkConfig[chainId]["subscriptionId"]
//         gasLane = networkConfig[chainId]["gasLane"]
//         callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]

//         provider = new ethers.providers.JsonRpcProvider("https://sepolia.base.org");

//     } else {
//         // vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
//         // subscriptionId = networkConfig[chainId]["subscriptionId"]
//     }

//     let signer0
//     let signer1
//     let signers
//     let addrs
    
//     signers = await ethers.getSigners();
//     signer0 = signers[0];
//     signer1 = signers[1];

//     let warbucks: WarBucks  
//     let st8craftgovtoken: St8craftGovToken
//     let aidcontract: AidContract
//     let airbattlecontract: AirBattleContract
//     let additionalairbattle: AdditionalAirBattle
//     let billscontract: BillsContract
//     let bombersmarketplace1: BombersMarketplace1
//     let bombersmarketplace2: BombersMarketplace2
//     let bomberscontract: BombersContract
//     let countryminter: CountryMinter
//     let countryparameterscontract: CountryParametersContract
//     let allianceManager: AllianceManager
//     let crimecontract: CrimeContract
//     let cruisemissilecontract: CruiseMissileContract
//     let environmentcontract: EnvironmentContract
//     let fighterscontract: FightersContract
//     let fighterlosses: FighterLosses
//     let fightersmarketplace1: FightersMarketplace1
//     let fightersmarketplace2: FightersMarketplace2
//     let forcescontract: ForcesContract
//     let missilescontract: MissilesContract
//     let groundbattlecontract: GroundBattleContract
//     let improvementscontract1: ImprovementsContract1
//     let improvementscontract2: ImprovementsContract2
//     let improvementscontract3: ImprovementsContract3
//     let improvementscontract4: ImprovementsContract4
//     let infrastructurecontract: InfrastructureContract
//     let infrastructuremarketplace: InfrastructureMarketContract
//     let keepercontract: KeeperContract
//     let landmarketcontract: LandMarketContract
//     let militarycontract: MilitaryContract
//     let nationstrengthcontract: NationStrengthContract
//     let navalactionscontract: NavalActionsContract
//     let navycontract: NavyContract
//     let navycontract2: NavyContract2
//     let additionalnavycontract: AdditionalNavyContract
//     let navalblockadecontract: NavalBlockadeContract
//     let breakblockadecontract: BreakBlocadeContract
//     let navalattackcontract: NavalAttackContract
//     let nukecontract: NukeContract
//     let resourcescontract: ResourcesContract
//     let bonusresourcescontract: BonusResourcesContract
//     let senatecontract: SenateContract
//     let spycontract: SpyContract
//     let spyoperationscontract: SpyOperationsContract
//     let taxescontract: TaxesContract
//     let additionaltaxescontract: AdditionalTaxesContract
//     let technologymarketcontrat: TechnologyMarketContract
//     let treasurycontract: TreasuryContract
//     let warcontract: WarContract
//     let wonderscontract1: WondersContract1
//     let wonderscontract2: WondersContract2
//     let wonderscontract3: WondersContract3
//     let wonderscontract4: WondersContract4
//     let messenger: Messenger

//     console.log("Deploying contracts with account:", deployer);

//     const INITIAL_SUPPLY_ST8CRAFT = ethers.utils.parseEther("200000000"); 
//     const INITIAL_SUPPLY_WARBUCKS = ethers.utils.parseEther("200000000000"); 

//     if (chainId === 31337) {

//         const warbucksArtifact = await artifacts.readArtifact("WarBucks");  
//         const WarBucksFactory = await new ContractFactory(
//             warbucksArtifact.abi, 
//             warbucksArtifact.bytecode, 
//             ledgerSigner
//         );
//         const deployedWarBucks = await WarBucksFactory.deploy(INITIAL_SUPPLY_WARBUCKS) as unknown as WarBucks;
//         await deployedWarBucks.waitForDeployment();
//         console.log("WarBucks deployed at:", await deployedWarBucks.getAddress());

//         const st8craftGovTokenArtifact = await artifacts.readArtifact("St8craftGovToken");
//         const St8craftGovTokenFactory = new ContractFactory(
//             st8craftGovTokenArtifact.abi,
//             st8craftGovTokenArtifact.bytecode,
//             ledgerSigner
//         );
//         const deployedSt8craftGovToken = await St8craftGovTokenFactory.deploy() as unknown as St8craftGovToken;
//         await deployedSt8craftGovToken.waitForDeployment();
//         console.log("St8craftGovToken deployed at:", await deployedSt8craftGovToken.getAddress());

//         const aidContractArtifact = await artifacts.readArtifact("AidContract");
//         const AidContractFactory = new ContractFactory(
//             aidContractArtifact.abi,
//             aidContractArtifact.bytecode,
//             ledgerSigner
//         );
//         const deployedAidContract = await AidContractFactory.deploy() as unknown as AidContract;
//         await deployedAidContract.waitForDeployment();
//         console.log("AidContract deployed at:", await deployedAidContract.getAddress());

//         const airBattleArtifact = await artifacts.readArtifact("AirBattleContract");
//         const AirBattleContractFactory = new ContractFactory(
//             airBattleArtifact.abi,
//             airBattleArtifact.bytecode,
//             ledgerSigner
//         );
//         const deployedAirBattleContract = await AirBattleContractFactory.deploy(
//             vrfCoordinatorV2Address,
//             subscriptionId,
//             gasLane,
//             callbackGasLimit
//         ) as unknown as AirBattleContract;
//         await deployedAirBattleContract.waitForDeployment();
//         console.log("AirBattleContract deployed at:", await deployedAirBattleContract.getAddress());

//         const additionalAirBattleArtifact = await artifacts.readArtifact("AdditionalAirBattle");
//         const AdditionalAirBattleFactory = new ContractFactory(
//             additionalAirBattleArtifact.abi,
//             additionalAirBattleArtifact.bytecode,
//             ledgerSigner
//         );
        
//         const deployedAdditionalAirBattle = await AdditionalAirBattleFactory.deploy() as unknown as AdditionalAirBattle;
//         await deployedAdditionalAirBattle.waitForDeployment();
//         console.log("AdditionalAirBattle deployed at:", await deployedAdditionalAirBattle.getAddress());

//         const billsArtifact = await artifacts.readArtifact("BillsContract");
//         const BillsContractFactory = new ContractFactory(billsArtifact.abi, billsArtifact.bytecode, ledgerSigner);
//         const deployedBillsContract = await BillsContractFactory.deploy() as unknown as BillsContract;
//         await deployedBillsContract.waitForDeployment();
//         console.log("BillsContract deployed at:", await deployedBillsContract.getAddress());

//         const bombersArtifact = await artifacts.readArtifact("BombersContract");
//         const BombersContractFactory = new ContractFactory(bombersArtifact.abi, bombersArtifact.bytecode, ledgerSigner);
//         const deployedBombersContract = await BombersContractFactory.deploy() as unknown as BombersContract;
//         await deployedBombersContract.waitForDeployment();
//         console.log("BombersContract deployed at:", await deployedBombersContract.getAddress());

//         const bombersMarketplace1Artifact = await artifacts.readArtifact("BombersMarketplace1");
//         const BombersMarketplace1Factory = new ContractFactory(bombersMarketplace1Artifact.abi, bombersMarketplace1Artifact.bytecode, ledgerSigner);
//         const deployedBombersMarketplace1 = await BombersMarketplace1Factory.deploy() as unknown as BombersMarketplace1;
//         await deployedBombersMarketplace1.waitForDeployment();
//         console.log("BombersMarketplace1 deployed at:", await deployedBombersMarketplace1.getAddress());

//         const bombersMarketplace2Artifact = await artifacts.readArtifact("BombersMarketplace2");
//         const BombersMarketplace2Factory = new ContractFactory(bombersMarketplace2Artifact.abi, bombersMarketplace2Artifact.bytecode, ledgerSigner);
//         const deployedBombersMarketplace2 = await BombersMarketplace2Factory.deploy() as unknown as BombersMarketplace2;
//         await deployedBombersMarketplace2.waitForDeployment();
//         console.log("BombersMarketplace2 deployed at:", await deployedBombersMarketplace2.getAddress());

//         const countryMinterArtifact = await artifacts.readArtifact("CountryMinter");
//         const CountryMinterFactory = new ContractFactory(countryMinterArtifact.abi, countryMinterArtifact.bytecode, ledgerSigner);
//         const deployedCountryMinter = await CountryMinterFactory.deploy() as unknown as CountryMinter;
//         await deployedCountryMinter.waitForDeployment();
//         console.log("CountryMinter deployed at:", await deployedCountryMinter.getAddress());

//         const countryParametersArtifact = await artifacts.readArtifact("CountryParametersContract");
//         const CountryParametersContractFactory = new ContractFactory(countryParametersArtifact.abi, countryParametersArtifact.bytecode, ledgerSigner);
//         const deployedCountryParametersContract = await CountryParametersContractFactory.deploy(
//         vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit
//         ) as unknown as CountryParametersContract;
//         await deployedCountryParametersContract.waitForDeployment();
//         console.log("CountryParametersContract deployed at:", await deployedCountryParametersContract.getAddress());

//         const allianceManagerArtifact = await artifacts.readArtifact("AllianceManager");
//         const AllianceManagerFactory = new ContractFactory(allianceManagerArtifact.abi, allianceManagerArtifact.bytecode, ledgerSigner);
//         const deployedAllianceManager = await AllianceManagerFactory.deploy() as unknown as AllianceManager;
//         await deployedAllianceManager.waitForDeployment();
//         console.log("AllianceManager deployed at:", await deployedAllianceManager.getAddress());

//         const crimeContractArtifact = await artifacts.readArtifact("CrimeContract");
//         const CrimeContractFactory = new ContractFactory(crimeContractArtifact.abi, crimeContractArtifact.bytecode, ledgerSigner);
//         const deployedCrimeContract = await CrimeContractFactory.deploy() as unknown as CrimeContract;
//         await deployedCrimeContract.waitForDeployment();
//         console.log("CrimeContract deployed at:", await deployedCrimeContract.getAddress());

//         const cruiseMissileArtifact = await artifacts.readArtifact("CruiseMissileContract");
//         const CruiseMissileContractFactory = new ContractFactory(cruiseMissileArtifact.abi, cruiseMissileArtifact.bytecode, ledgerSigner);
//         const deployedCruiseMissileContract = await CruiseMissileContractFactory.deploy(
//         vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit
//         ) as unknown as CruiseMissileContract;
//         await deployedCruiseMissileContract.waitForDeployment();
//         console.log("CruiseMissileContract deployed at:", await deployedCruiseMissileContract.getAddress());

//         const environmentArtifact = await artifacts.readArtifact("EnvironmentContract");
//         const EnvironmentContractFactory = new ContractFactory(environmentArtifact.abi, environmentArtifact.bytecode, ledgerSigner);
//         const deployedEnvironmentContract = await EnvironmentContractFactory.deploy() as unknown as EnvironmentContract;
//         await deployedEnvironmentContract.waitForDeployment();
//         console.log("EnvironmentContract deployed at:", await deployedEnvironmentContract.getAddress());

//         const fightersArtifact = await artifacts.readArtifact("FightersContract");
//         const FightersContractFactory = new ContractFactory(fightersArtifact.abi, fightersArtifact.bytecode, ledgerSigner);
//         const deployedFightersContract = await FightersContractFactory.deploy() as unknown as FightersContract;
//         await deployedFightersContract.waitForDeployment();
//         console.log("FightersContract deployed at:", await deployedFightersContract.getAddress());

//         const fighterLossesArtifact = await artifacts.readArtifact("FighterLosses");
//         const FighterLossesFactory = new ContractFactory(fighterLossesArtifact.abi, fighterLossesArtifact.bytecode, ledgerSigner);
//         const deployedFighterLosses = await FighterLossesFactory.deploy() as unknown as FighterLosses;
//         await deployedFighterLosses.waitForDeployment();
//         console.log("FighterLosses deployed at:", await deployedFighterLosses.getAddress());

//         const fightersMarketplace1Artifact = await artifacts.readArtifact("FightersMarketplace1");
//         const FightersMarketplace1Factory = new ContractFactory(fightersMarketplace1Artifact.abi, fightersMarketplace1Artifact.bytecode, ledgerSigner);
//         const deployedFightersMarketplace1 = await FightersMarketplace1Factory.deploy() as unknown as FightersMarketplace1;
//         await deployedFightersMarketplace1.waitForDeployment();
//         console.log("FightersMarketplace1 deployed at:", await deployedFightersMarketplace1.getAddress());

//         const fightersMarketplace2Artifact = await artifacts.readArtifact("FightersMarketplace2");
//         const FightersMarketplace2Factory = new ContractFactory(fightersMarketplace2Artifact.abi, fightersMarketplace2Artifact.bytecode, ledgerSigner);
//         const deployedFightersMarketplace2 = await FightersMarketplace2Factory.deploy() as unknown as FightersMarketplace2;
//         await deployedFightersMarketplace2.waitForDeployment();
//         console.log("FightersMarketplace2 deployed at:", await deployedFightersMarketplace2.getAddress());

//         const forcesContractArtifact = await artifacts.readArtifact("ForcesContract");
//         const ForcesContractFactory = new ContractFactory(forcesContractArtifact.abi, forcesContractArtifact.bytecode, ledgerSigner);
//         const deployedForcesContract = await ForcesContractFactory.deploy() as unknown as ForcesContract;
//         await deployedForcesContract.waitForDeployment();
//         console.log("ForcesContract deployed at:", await deployedForcesContract.getAddress());

//         const spyContractArtifact = await artifacts.readArtifact("SpyContract");
//         const SpyContractFactory = new ContractFactory(spyContractArtifact.abi, spyContractArtifact.bytecode, ledgerSigner);
//         const deployedSpyContract = await SpyContractFactory.deploy() as unknown as SpyContract;
//         await deployedSpyContract.waitForDeployment();
//         console.log("SpyContract deployed at:", await deployedSpyContract.getAddress());

//         const missilesContractArtifact = await artifacts.readArtifact("MissilesContract");
//         const MissilesContractFactory = new ContractFactory(missilesContractArtifact.abi, missilesContractArtifact.bytecode, ledgerSigner);
//         const deployedMissilesContract = await MissilesContractFactory.deploy() as unknown as MissilesContract;
//         await deployedMissilesContract.waitForDeployment();
//         console.log("MissilesContract deployed at:", await deployedMissilesContract.getAddress());

//         const groundBattleArtifact = await artifacts.readArtifact("GroundBattleContract");
//         const GroundBattleContractFactory = new ContractFactory(groundBattleArtifact.abi, groundBattleArtifact.bytecode, ledgerSigner);
//         const deployedGroundBattleContract = await GroundBattleContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as unknown as GroundBattleContract;
//         await deployedGroundBattleContract.waitForDeployment();
//         console.log("GroundBattleContract deployed at:", await deployedGroundBattleContract.getAddress());

//         const improvements1Artifact = await artifacts.readArtifact("ImprovementsContract1");
//         const ImprovementsContract1Factory = new ContractFactory(improvements1Artifact.abi, improvements1Artifact.bytecode, ledgerSigner);
//         const deployedImprovementsContract1 = await ImprovementsContract1Factory.deploy() as unknown as ImprovementsContract1;
//         await deployedImprovementsContract1.waitForDeployment();
//         console.log("ImprovementsContract1 deployed at:", await deployedImprovementsContract1.getAddress());

//         const improvements2Artifact = await artifacts.readArtifact("ImprovementsContract2");
//         const ImprovementsContract2Factory = new ContractFactory(improvements2Artifact.abi, improvements2Artifact.bytecode, ledgerSigner);
//         const deployedImprovementsContract2 = await ImprovementsContract2Factory.deploy() as unknown as ImprovementsContract2;
//         await deployedImprovementsContract2.waitForDeployment();
//         console.log("ImprovementsContract2 deployed at:", await deployedImprovementsContract2.getAddress());

//         const improvements3Artifact = await artifacts.readArtifact("ImprovementsContract3");
//         const ImprovementsContract3Factory = new ContractFactory(improvements3Artifact.abi, improvements3Artifact.bytecode, ledgerSigner);
//         const deployedImprovementsContract3 = await ImprovementsContract3Factory.deploy() as unknown as ImprovementsContract3;
//         await deployedImprovementsContract3.waitForDeployment();
//         console.log("ImprovementsContract3 deployed at:", await deployedImprovementsContract3.getAddress());

//         const improvements4Artifact = await artifacts.readArtifact("ImprovementsContract4");
//         const ImprovementsContract4Factory = new ContractFactory(improvements4Artifact.abi, improvements4Artifact.bytecode, ledgerSigner);
//         const deployedImprovementsContract4 = await ImprovementsContract4Factory.deploy() as unknown as ImprovementsContract4;
//         await deployedImprovementsContract4.waitForDeployment();
//         console.log("ImprovementsContract4 deployed at:", await deployedImprovementsContract4.getAddress());
    
//         const infrastructureArtifact = await artifacts.readArtifact("InfrastructureContract");
//         const InfrastructureContractFactory = new ContractFactory(infrastructureArtifact.abi, infrastructureArtifact.bytecode, ledgerSigner);
//         const deployedInfrastructureContract = await InfrastructureContractFactory.deploy() as unknown as InfrastructureContract;
//         await deployedInfrastructureContract.waitForDeployment();
//         console.log("InfrastructureContract deployed at:", await deployedInfrastructureContract.getAddress());
        
//         const infrastructureMarketArtifact = await artifacts.readArtifact("InfrastructureMarketContract");
//         const InfrastructureMarketContractFactory = new ContractFactory(infrastructureMarketArtifact.abi, infrastructureMarketArtifact.bytecode, ledgerSigner);
//         const deployedInfrastructureMarketContract = await InfrastructureMarketContractFactory.deploy() as unknown as InfrastructureMarketContract;
//         await deployedInfrastructureMarketContract.waitForDeployment();
//         console.log("InfrastructureMarketContract deployed at:", await deployedInfrastructureMarketContract.getAddress());
        
//         const keeperArtifact = await artifacts.readArtifact("KeeperContract");
//         const KeeperContractFactory = new ContractFactory(keeperArtifact.abi, keeperArtifact.bytecode, ledgerSigner);
//         const deployedKeeperContract = await KeeperContractFactory.deploy() as unknown as KeeperContract;
//         await deployedKeeperContract.waitForDeployment();
//         console.log("KeeperContract deployed at:", await deployedKeeperContract.getAddress());
        
//         const landMarketArtifact = await artifacts.readArtifact("LandMarketContract");
//         const LandMarketContractFactory = new ContractFactory(landMarketArtifact.abi, landMarketArtifact.bytecode, ledgerSigner);
//         const deployedLandMarketContract = await LandMarketContractFactory.deploy() as unknown as LandMarketContract;
//         await deployedLandMarketContract.waitForDeployment();
//         console.log("LandMarketContract deployed at:", await deployedLandMarketContract.getAddress());
        
//         const militaryArtifact = await artifacts.readArtifact("MilitaryContract");
//         const MilitaryContractFactory = new ContractFactory(militaryArtifact.abi, militaryArtifact.bytecode, ledgerSigner);
//         const deployedMilitaryContract = await MilitaryContractFactory.deploy() as unknown as MilitaryContract;
//         await deployedMilitaryContract.waitForDeployment();
//         console.log("MilitaryContract deployed at:", await deployedMilitaryContract.getAddress());
    
//         const nationStrengthArtifact = await artifacts.readArtifact("NationStrengthContract");
//         const NationStrengthContractFactory = new ContractFactory(nationStrengthArtifact.abi, nationStrengthArtifact.bytecode, ledgerSigner);
//         const deployedNationStrengthContract = await NationStrengthContractFactory.deploy() as unknown as NationStrengthContract;
//         await deployedNationStrengthContract.waitForDeployment();
//         console.log("NationStrengthContract deployed at:", await deployedNationStrengthContract.getAddress());
        
//         const navyArtifact = await artifacts.readArtifact("NavyContract");
//         const NavyContractFactory = new ContractFactory(navyArtifact.abi, navyArtifact.bytecode, ledgerSigner);
//         const deployedNavyContract = await NavyContractFactory.deploy() as unknown as NavyContract;
//         await deployedNavyContract.waitForDeployment();
//         console.log("NavyContract deployed at:", await deployedNavyContract.getAddress());
        
//         const navy2Artifact = await artifacts.readArtifact("NavyContract2");
//         const NavyContract2Factory = new ContractFactory(navy2Artifact.abi, navy2Artifact.bytecode, ledgerSigner);
//         const deployedNavyContract2 = await NavyContract2Factory.deploy() as unknown as NavyContract2;
//         await deployedNavyContract2.waitForDeployment();
//         console.log("NavyContract2 deployed at:", await deployedNavyContract2.getAddress());
        
//         const additionalNavyArtifact = await artifacts.readArtifact("AdditionalNavyContract");
//         const AdditionalNavyContractFactory = new ContractFactory(additionalNavyArtifact.abi, additionalNavyArtifact.bytecode, ledgerSigner);
//         const deployedAdditionalNavyContract = await AdditionalNavyContractFactory.deploy() as unknown as AdditionalNavyContract;
//         await deployedAdditionalNavyContract.waitForDeployment();
//         console.log("AdditionalNavyContract deployed at:", await deployedAdditionalNavyContract.getAddress());
        
//         const navalActionsArtifact = await artifacts.readArtifact("NavalActionsContract");
//         const NavalActionsContractFactory = new ContractFactory(navalActionsArtifact.abi, navalActionsArtifact.bytecode, ledgerSigner);
//         const deployedNavalActionsContract = await NavalActionsContractFactory.deploy() as unknown as NavalActionsContract;
//         await deployedNavalActionsContract.waitForDeployment();
//         console.log("NavalActionsContract deployed at:", await deployedNavalActionsContract.getAddress());
        
//         const navalBlockadeArtifact = await artifacts.readArtifact("NavalBlockadeContract");
//         const NavalBlockadeContractFactory = new ContractFactory(navalBlockadeArtifact.abi, navalBlockadeArtifact.bytecode, ledgerSigner);
//         const deployedNavalBlockadeContract = await NavalBlockadeContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as unknown as NavalBlockadeContract;
//         await deployedNavalBlockadeContract.waitForDeployment();
//         console.log("NavalBlockadeContract deployed at:", await deployedNavalBlockadeContract.getAddress());
        
//         const breakBlocadeArtifact = await artifacts.readArtifact("BreakBlocadeContract");
//         const BreakBlocadeContractFactory = new ContractFactory(breakBlocadeArtifact.abi, breakBlocadeArtifact.bytecode, ledgerSigner);
//         const deployedBreakBlocadeContract = await BreakBlocadeContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as unknown as BreakBlocadeContract;
//         await deployedBreakBlocadeContract.waitForDeployment();
//         console.log("BreakBlocadeContract deployed at:", await deployedBreakBlocadeContract.getAddress());
        
//         const navalAttackArtifact = await artifacts.readArtifact("NavalAttackContract");
//         const NavalAttackContractFactory = new ContractFactory(navalAttackArtifact.abi, navalAttackArtifact.bytecode, ledgerSigner);
//         const deployedNavalAttackContract = await NavalAttackContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as unknown as NavalAttackContract;
//         await deployedNavalAttackContract.waitForDeployment();
//         console.log("NavalAttackContract deployed at:", await deployedNavalAttackContract.getAddress());
        
//         const nukeArtifact = await artifacts.readArtifact("NukeContract");
//         const NukeContractFactory = new ContractFactory(nukeArtifact.abi, nukeArtifact.bytecode, ledgerSigner);
//         const deployedNukeContract = await NukeContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as unknown as NukeContract;
//         await deployedNukeContract.waitForDeployment();
//         console.log("NukeContract deployed at:", await deployedNukeContract.getAddress());
        
//         const resourcesArtifact = await artifacts.readArtifact("ResourcesContract");
//         const ResourcesContractFactory = new ContractFactory(resourcesArtifact.abi, resourcesArtifact.bytecode, ledgerSigner);
//         const deployedResourcesContract = await ResourcesContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as unknown as ResourcesContract;
//         await deployedResourcesContract.waitForDeployment();
//         console.log("ResourcesContract deployed at:", await deployedResourcesContract.getAddress());
        
//         const bonusResourcesArtifact = await artifacts.readArtifact("BonusResourcesContract");
//         const BonusResourcesContractFactory = new ContractFactory(bonusResourcesArtifact.abi, bonusResourcesArtifact.bytecode, ledgerSigner);
//         const deployedBonusResourcesContract = await BonusResourcesContractFactory.deploy() as unknown as BonusResourcesContract;
//         await deployedBonusResourcesContract.waitForDeployment();
//         console.log("BonusResourcesContract deployed at:", await deployedBonusResourcesContract.getAddress());
        
//         const senateArtifact = await artifacts.readArtifact("SenateContract");
//         const SenateContractFactory = new ContractFactory(senateArtifact.abi, senateArtifact.bytecode, ledgerSigner);
//         const deployedSenateContract = await SenateContractFactory.deploy() as unknown as SenateContract;
//         await deployedSenateContract.waitForDeployment();
//         console.log("SenateContract deployed at:", await deployedSenateContract.getAddress());
        
//         const spyOperationsArtifact = await artifacts.readArtifact("SpyOperationsContract");
//         const SpyOperationsContractFactory = new ContractFactory(spyOperationsArtifact.abi, spyOperationsArtifact.bytecode, ledgerSigner);
//         const deployedSpyOperationsContract = await SpyOperationsContractFactory.deploy() as unknown as SpyOperationsContract;
//         await deployedSpyOperationsContract.waitForDeployment();
//         console.log("SpyOperationsContract deployed at:", await deployedSpyOperationsContract.getAddress());
        
//         const taxesArtifact = await artifacts.readArtifact("TaxesContract");
//         const TaxesContractFactory = new ContractFactory(taxesArtifact.abi, taxesArtifact.bytecode, ledgerSigner);
//         const deployedTaxesContract = await TaxesContractFactory.deploy() as unknown as TaxesContract;
//         await deployedTaxesContract.waitForDeployment();
//         console.log("TaxesContract deployed at:", await deployedTaxesContract.getAddress());
        
//         const additionalTaxesArtifact = await artifacts.readArtifact("AdditionalTaxesContract");
//         const AdditionalTaxesContractFactory = new ContractFactory(additionalTaxesArtifact.abi, additionalTaxesArtifact.bytecode, ledgerSigner);
//         const deployedAdditionalTaxesContract = await AdditionalTaxesContractFactory.deploy() as unknown as AdditionalTaxesContract;
//         await deployedAdditionalTaxesContract.waitForDeployment();
//         console.log("AdditionalTaxesContract deployed at:", await deployedAdditionalTaxesContract.getAddress());
        
    
//         const techMarketArtifact = await artifacts.readArtifact("TechnologyMarketContract");
//         const TechnologyMarketContractFactory = new ContractFactory(techMarketArtifact.abi, techMarketArtifact.bytecode, ledgerSigner);
//         const deployedTechnologyMarketContract = await TechnologyMarketContractFactory.deploy() as unknown as TechnologyMarketContract;
//         await deployedTechnologyMarketContract.waitForDeployment();
//         console.log("TechnologyMarketContract deployed at:", await deployedTechnologyMarketContract.getAddress());
        
//         const treasuryArtifact = await artifacts.readArtifact("TreasuryContract");
//         const TreasuryContractFactory = new ContractFactory(treasuryArtifact.abi, treasuryArtifact.bytecode, ledgerSigner);
//         const deployedTreasuryContract = await TreasuryContractFactory.deploy() as unknown as TreasuryContract;
//         await deployedTreasuryContract.waitForDeployment();
//         console.log("TreasuryContract deployed at:", await deployedTreasuryContract.getAddress());
        
//         const warArtifact = await artifacts.readArtifact("WarContract");
//         const WarContractFactory = new ContractFactory(warArtifact.abi, warArtifact.bytecode, ledgerSigner);
//         const deployedWarContract = await WarContractFactory.deploy() as unknown as WarContract;
//         await deployedWarContract.waitForDeployment();
//         console.log("WarContract deployed at:", await deployedWarContract.getAddress());
        
//         const wonders1Artifact = await artifacts.readArtifact("WondersContract1");
//         const WondersContract1Factory = new ContractFactory(wonders1Artifact.abi, wonders1Artifact.bytecode, ledgerSigner);
//         const deployedWondersContract1 = await WondersContract1Factory.deploy() as unknown as WondersContract1;
//         await deployedWondersContract1.waitForDeployment();
//         console.log("WondersContract1 deployed at:", await deployedWondersContract1.getAddress());
        
//         const wonders2Artifact = await artifacts.readArtifact("WondersContract2");
//         const WondersContract2Factory = new ContractFactory(wonders2Artifact.abi, wonders2Artifact.bytecode, ledgerSigner);
//         const deployedWondersContract2 = await WondersContract2Factory.deploy() as unknown as WondersContract2;
//         await deployedWondersContract2.waitForDeployment();
//         console.log("WondersContract2 deployed at:", await deployedWondersContract2.getAddress());
        
//         const wonders3Artifact = await artifacts.readArtifact("WondersContract3");
//         const WondersContract3Factory = new ContractFactory(wonders3Artifact.abi, wonders3Artifact.bytecode, ledgerSigner);
//         const deployedWondersContract3 = await WondersContract3Factory.deploy() as unknown as WondersContract3;
//         await deployedWondersContract3.waitForDeployment();
//         console.log("WondersContract3 deployed at:", await deployedWondersContract3.getAddress());
        
//         const wonders4Artifact = await artifacts.readArtifact("WondersContract4");
//         const WondersContract4Factory = new ContractFactory(wonders4Artifact.abi, wonders4Artifact.bytecode, ledgerSigner);
//         const deployedWondersContract4 = await WondersContract4Factory.deploy() as unknown as WondersContract4;
//         await deployedWondersContract4.waitForDeployment();
//         console.log("WondersContract4 deployed at:", await deployedWondersContract4.getAddress());
        
//         const messengerArtifact = await artifacts.readArtifact("Messenger");
//         const MessengerFactory = new ContractFactory(messengerArtifact.abi, messengerArtifact.bytecode, ledgerSigner);
//         const deployedMessenger = await MessengerFactory.deploy() as unknown as Messenger;
//         await deployedMessenger.waitForDeployment();
//         console.log("Messenger deployed at:", await deployedMessenger.getAddress());
        
//         const warbucks = deployedWarBucks;
//         const warbucksContract = deployedWarBucks;
//         const st8craftgovtoken = deployedSt8craftGovToken;
//         const aidcontract = deployedAidContract;
//         const airbattlecontract = deployedAirBattleContract;
//         const additionalairbattle = deployedAdditionalAirBattle;
//         const billscontract = deployedBillsContract;
//         const bomberscontract = deployedBombersContract;
//         const bombersmarketplace1 = deployedBombersMarketplace1;
//         const bombersmarketplace2 = deployedBombersMarketplace2;
//         const countryminter = deployedCountryMinter;
//         const countryparameterscontract = deployedCountryParametersContract;
//         const allianceManager = deployedAllianceManager;
//         const crimecontract = deployedCrimeContract;
//         const cruisemissilecontract = deployedCruiseMissileContract;
//         const environmentcontract = deployedEnvironmentContract;
//         const fighterscontract = deployedFightersContract;
//         const fighterlosses = deployedFighterLosses;
//         const fightersmarketplace1 = deployedFightersMarketplace1;
//         const fightersmarketplace2 = deployedFightersMarketplace2;
//         const forcescontract = deployedForcesContract;
//         const spycontract = deployedSpyContract;
//         const missilescontract = deployedMissilesContract;
//         const groundbattlecontract = deployedGroundBattleContract;
//         const improvementscontract1 = deployedImprovementsContract1;
//         const improvementscontract2 = deployedImprovementsContract2;
//         const improvementscontract3 = deployedImprovementsContract3;
//         const improvementscontract4 = deployedImprovementsContract4;
//         const infrastructurecontract = deployedInfrastructureContract;
//         const infrastructuremarketplace = deployedInfrastructureMarketContract;
//         const keepercontract = deployedKeeperContract;
//         const landmarketcontract = deployedLandMarketContract;
//         const militarycontract = deployedMilitaryContract;
//         const nationstrengthcontract = deployedNationStrengthContract;
//         const navycontract = deployedNavyContract;
//         const navycontract2 = deployedNavyContract2;
//         const additionalnavycontract = deployedAdditionalNavyContract;
//         const navalactionscontract = deployedNavalActionsContract;
//         const navalblockadecontract = deployedNavalBlockadeContract;
//         const breakblockadecontract = deployedBreakBlocadeContract;
//         const navalattackcontract = deployedNavalAttackContract;
//         const nukecontract = deployedNukeContract;
//         const resourcescontract = deployedResourcesContract;
//         const bonusresourcescontract = deployedBonusResourcesContract;
//         const senatecontract = deployedSenateContract;
//         const spyoperationscontract = deployedSpyOperationsContract;
//         const taxescontract = deployedTaxesContract;
//         const additionaltaxescontract = deployedAdditionalTaxesContract;
//         const technologymarketcontrat = deployedTechnologyMarketContract;
//         const treasurycontract = deployedTreasuryContract;
//         const warcontract = deployedWarContract;
//         const wonderscontract1 = deployedWondersContract1;
//         const wonderscontract2 = deployedWondersContract2;
//         const wonderscontract3 = deployedWondersContract3;
//         const wonderscontract4 = deployedWondersContract4;
//         const messenger = deployedMessenger;

//         await deployedWarBucks.settings(
//             deployedTreasuryContract.getAddress(),
//             deployedCountryMinter.getAddress(),
//         )

//         console.log("warbucks settings");

//         await deployedAidContract.settings(
//             await deployedCountryMinter.getAddress(),
//             await deployedTreasuryContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedKeeperContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedSenateContract.getAddress(),
//             await deployedCountryParametersContract.getAddress()
//           );                  
       
//         console.log("aid contract settings");

//         await deployedAirBattleContract.settings(
//             await deployedWarContract.getAddress(),
//             await deployedFightersContract.getAddress(),
//             await deployedBombersContract.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedFighterLosses.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedAdditionalAirBattle.getAddress()
//           );          

//         console.log("air battle contract settings");

//         await deployedAdditionalAirBattle.settings(
//             await deployedWarContract.getAddress(),
//             await deployedFightersContract.getAddress(),
//             await deployedBombersContract.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedFighterLosses.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedAirBattleContract.getAddress()
//           );

//         console.log("additional air battle contract settings");

//         await deployedBillsContract.settings(
//             await deployedCountryMinter.getAddress(),
//             await deployedTreasuryContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedWondersContract2.getAddress(),
//             await deployedWondersContract3.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedFightersContract.getAddress(),
//             await deployedNavyContract.getAddress(),
//             await deployedResourcesContract.getAddress()
//           );
          
//           await deployedBillsContract.settings2(
//             await deployedImprovementsContract1.getAddress(),
//             await deployedImprovementsContract2.getAddress(),
//             await deployedMissilesContract.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedBonusResourcesContract.getAddress(),
//             await deployedNavyContract2.getAddress(),
//             await deployedCountryParametersContract.getAddress(),
//             await deployedNavalBlockadeContract.getAddress()
//           );
          

//         console.log("bills contract settings");
        
//         await deployedBombersContract.settings(
//             await deployedCountryMinter.getAddress(),
//             await deployedBombersMarketplace1.getAddress(),
//             await deployedBombersMarketplace2.getAddress(),
//             await deployedAirBattleContract.getAddress(),
//             await deployedTreasuryContract.getAddress(),
//             await deployedFightersContract.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedWarContract.getAddress()
//           );

//         console.log("bombers contract settings");

//         await deployedBombersMarketplace1.settings(
//             await deployedCountryMinter.getAddress(),
//             await deployedBombersContract.getAddress(),
//             await deployedFightersContract.getAddress(),
//             await deployedFightersMarketplace1.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedTreasuryContract.getAddress()
//           );

//         console.log("bombers marketplace 1 settings");

//         await deployedBombersMarketplace2.settings(
//             await deployedCountryMinter.getAddress(),
//             await deployedBombersContract.getAddress(),
//             await deployedFightersContract.getAddress(),
//             await deployedFightersMarketplace1.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedTreasuryContract.getAddress()
//           );
        
//         console.log("bombers marketplace 2 settings");
        
//         await deployedCountryMinter.settings(
//             await deployedCountryParametersContract.getAddress(),
//             await deployedTreasuryContract.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedResourcesContract.getAddress(),
//             await deployedMissilesContract.getAddress(),
//             await deployedSenateContract.getAddress(),
//             await deployedWarBucks.getAddress(),
//             await deployedBonusResourcesContract.getAddress()
//           );
          
//           await deployedCountryMinter.settings2(
//             await deployedImprovementsContract1.getAddress(),
//             await deployedImprovementsContract2.getAddress(),
//             await deployedImprovementsContract3.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedWondersContract2.getAddress(),
//             await deployedWondersContract3.getAddress(),
//             await deployedWondersContract4.getAddress()
//           );
          
//           await deployedCountryMinter.settings3(
//             await deployedMilitaryContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedNavyContract.getAddress(),
//             await deployedNavyContract2.getAddress(),
//             await deployedNavalActionsContract.getAddress(),
//             await deployedFightersContract.getAddress(),
//             await deployedBombersContract.getAddress()
//           );
        
//         console.log("country minter settings");
        
//         await deployedCountryParametersContract.settings(
//             await deployedSpyOperationsContract.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedSenateContract.getAddress(),
//             await deployedKeeperContract.getAddress(),
//             await deployedNukeContract.getAddress(),
//             await deployedGroundBattleContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedTreasuryContract.getAddress()
//           );

//         console.log("country parameters contract settings");

//         await deployedAllianceManager.settings(
//             await deployedCountryMinter.getAddress()
//           );

//         console.log("alliance manager settings");

//         await deployedCrimeContract.settings(
//             await deployedInfrastructureContract.getAddress(),
//             await deployedImprovementsContract1.getAddress(),
//             await deployedImprovementsContract2.getAddress(),
//             await deployedImprovementsContract3.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedCountryParametersContract.getAddress(),
//             await deployedWondersContract2.getAddress()
//           );
        
//         console.log("crime contract settings");
        
//         await deployedCruiseMissileContract.settings(
//             await deployedForcesContract.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedWarContract.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedMissilesContract.getAddress()
//           );
          
//           await deployedCruiseMissileContract.settings2(
//             await deployedImprovementsContract1.getAddress(),
//             await deployedImprovementsContract3.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedWondersContract2.getAddress()
//           );
        
//         console.log("cruise missile contract settings");

//         await deployedEnvironmentContract.settings(
//             await deployedCountryMinter.getAddress(),
//             await deployedResourcesContract.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedWondersContract3.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedCountryParametersContract.getAddress(),
//             await deployedAdditionalTaxesContract.getAddress(),
//             await deployedMissilesContract.getAddress(),
//             await deployedNukeContract.getAddress()
//           );
          
//           await deployedEnvironmentContract.settings2(
//             await deployedImprovementsContract1.getAddress(),
//             await deployedImprovementsContract3.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedBonusResourcesContract.getAddress()
//           );

//         console.log("environment contract settings");
        
//         await deployedFightersContract.settings(
//             await deployedCountryMinter.getAddress(),
//             await deployedFightersMarketplace1.getAddress(),
//             await deployedFightersMarketplace2.getAddress(),
//             await deployedTreasuryContract.getAddress(),
//             await deployedWarContract.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedResourcesContract.getAddress(),
//             await deployedImprovementsContract1.getAddress(),
//             await deployedAirBattleContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedFighterLosses.getAddress()
//           );
          
//           await deployedFightersContract.settings2(
//             await deployedNavyContract.getAddress(),
//             await deployedBombersContract.getAddress()
//           );
        
//         console.log("fighters contract settings");
        
//         await deployedFighterLosses.settings(
//             await deployedFightersContract.getAddress(),
//             await deployedAirBattleContract.getAddress()
//           );

//         console.log("fighter losses settings");

//         await deployedFightersMarketplace1.settings(
//             await deployedCountryMinter.getAddress(),
//             await deployedBombersContract.getAddress(),
//             await deployedFightersContract.getAddress(),
//             await deployedTreasuryContract.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedResourcesContract.getAddress(),
//             await deployedImprovementsContract1.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedNavyContract.getAddress()
//           );
          
//           await deployedFightersMarketplace1.settings2(
//             await deployedBonusResourcesContract.getAddress(),
//             await deployedNavyContract2.getAddress()
//           );

//         console.log("fighters marketplace 1 settings");
        
//         await deployedFightersMarketplace2.settings(
//             await deployedCountryMinter.getAddress(),
//             await deployedBombersContract.getAddress(),
//             await deployedFightersContract.getAddress(),
//             await deployedFightersMarketplace1.getAddress(),
//             await deployedTreasuryContract.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedResourcesContract.getAddress(),
//             await deployedImprovementsContract1.getAddress()
//           );
        
//         console.log("fighters marketplace 2 settings");
        
//         await deployedForcesContract.settings(
//             await deployedTreasuryContract.getAddress(),
//             await deployedAidContract.getAddress(),
//             await deployedSpyOperationsContract.getAddress(),
//             await deployedCruiseMissileContract.getAddress(),
//             await deployedNukeContract.getAddress(),
//             await deployedAirBattleContract.getAddress(),
//             await deployedGroundBattleContract.getAddress(),
//             await deployedWarContract.getAddress()
//           );
          
//           await deployedForcesContract.settings2(
//             await deployedInfrastructureContract.getAddress(),
//             await deployedResourcesContract.getAddress(),
//             await deployedImprovementsContract1.getAddress(),
//             await deployedImprovementsContract2.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedKeeperContract.getAddress(),
//             await deployedCountryParametersContract.getAddress()
//           );
        
//         console.log("forces contract settings");
        
//         await deployedMissilesContract.settings(
//             await deployedTreasuryContract.getAddress(),
//             await deployedSpyOperationsContract.getAddress(),
//             await deployedNukeContract.getAddress(),
//             await deployedAirBattleContract.getAddress(),
//             await deployedWondersContract2.getAddress(),
//             await deployedNationStrengthContract.getAddress(),
//             await deployedInfrastructureContract.getAddress()
//           );
          
//           await deployedMissilesContract.settings2(
//             await deployedResourcesContract.getAddress(),
//             await deployedImprovementsContract1.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedKeeperContract.getAddress()
//           );
        
//         console.log("missiles contract settings");
            
//         await deployedGroundBattleContract.settings(
//             await deployedWarContract.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedTreasuryContract.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedMilitaryContract.getAddress()
//           );
          
//           await deployedGroundBattleContract.settings2(
//             await deployedImprovementsContract2.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedWondersContract3.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedAdditionalTaxesContract.getAddress(),
//             await deployedCountryParametersContract.getAddress()
//           );
        
//         console.log("ground battle contract settings");
        
//         await deployedImprovementsContract1.settings(
//             await deployedTreasuryContract.getAddress(),
//             await deployedImprovementsContract2.getAddress(),
//             await deployedImprovementsContract3.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedNavyContract.getAddress(),
//             await deployedAdditionalNavyContract.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedInfrastructureContract.getAddress()
//           );
        
//         console.log("improvements contract 1 settings");

//         await deployedImprovementsContract2.settings(
//             await deployedTreasuryContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedImprovementsContract1.getAddress(),
//             await deployedResourcesContract.getAddress(),
//             await deployedSpyContract.getAddress()
//           );

//         console.log("improvements contract 2 settings");
        
//         await deployedImprovementsContract3.settings(
//             await deployedTreasuryContract.getAddress(),
//             await deployedAdditionalNavyContract.getAddress(),
//             await deployedImprovementsContract1.getAddress(),
//             await deployedImprovementsContract2.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedBonusResourcesContract.getAddress(),
//             await deployedWondersContract4.getAddress()
//         );

//         console.log("improvements contract 3 settings");
        
//         await deployedImprovementsContract4.settings(
//             await deployedTreasuryContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedImprovementsContract1.getAddress(),
//             await deployedImprovementsContract2.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedResourcesContract.getAddress()
//           );

//         console.log("improvements contract 4 settings");
        
//         await deployedInfrastructureContract.settings1(
//             await deployedResourcesContract.getAddress(),
//             await deployedImprovementsContract1.getAddress(),
//             await deployedImprovementsContract2.getAddress(),
//             await deployedImprovementsContract3.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedInfrastructureMarketContract.getAddress(),
//             await deployedTechnologyMarketContract.getAddress(),
//             await deployedLandMarketContract.getAddress(),
//             await deployedBonusResourcesContract.getAddress()
//         );

//         await deployedInfrastructureContract.settings2(
//             await deployedWondersContract1.getAddress(),
//             await deployedWondersContract2.getAddress(),
//             await deployedWondersContract3.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedTreasuryContract.getAddress(),
//             await deployedCountryParametersContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedAidContract.getAddress()
//         );

//         await deployedInfrastructureContract.settings3(
//             await deployedSpyOperationsContract.getAddress(),
//             await deployedTaxesContract.getAddress(),
//             await deployedCruiseMissileContract.getAddress(),
//             await deployedNukeContract.getAddress(),
//             await deployedAirBattleContract.getAddress(),
//             await deployedGroundBattleContract.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedCrimeContract.getAddress(),
//             await deployedCountryParametersContract.getAddress()
//         );

//         console.log("infrastructure contract settings");

//         await deployedInfrastructureMarketContract.settings(
//             await deployedResourcesContract.getAddress(),
//             await deployedCountryParametersContract.getAddress(),
//             await deployedImprovementsContract1.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedWondersContract2.getAddress(),
//             await deployedWondersContract3.getAddress(),
//             await deployedTreasuryContract.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedBonusResourcesContract.getAddress()
//           );

//         console.log("infrastructure marketplace settings");

//         await deployedLandMarketContract.settings(
//             await deployedResourcesContract.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedTreasuryContract.getAddress()
//           );

//         console.log("land market contract settings");

//         await deployedMilitaryContract.settings(
//             await deployedSpyOperationsContract.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedKeeperContract.getAddress()
//           );

//         console.log("military contract settings");

//         await deployedNationStrengthContract.settings(
//             await deployedInfrastructureContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedFightersContract.getAddress(),
//             await deployedBombersContract.getAddress(),
//             await deployedNavyContract.getAddress(),
//             await deployedMissilesContract.getAddress(),
//             await deployedNavyContract2.getAddress()
//           );

//         console.log("nation strength contract settings");

//         await deployedNavyContract.settings(
//             await deployedTreasuryContract.getAddress(),
//             await deployedImprovementsContract1.getAddress(),
//             await deployedImprovementsContract3.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedResourcesContract.getAddress(),
//             await deployedMilitaryContract.getAddress(),
//             await deployedNukeContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedNavalActionsContract.getAddress(),
//             await deployedAdditionalNavyContract.getAddress()
//           );
          
//           await deployedNavyContract.settings2(
//             await deployedCountryMinter.getAddress(),
//             await deployedBonusResourcesContract.getAddress(),
//             await deployedNavyContract2.getAddress(),
//             await deployedInfrastructureContract.getAddress()
//           );

//         console.log("navy contract settings");

//         await deployedNavyContract2.settings(
//             await deployedTreasuryContract.getAddress(),
//             await deployedImprovementsContract1.getAddress(),
//             await deployedImprovementsContract3.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedResourcesContract.getAddress(),
//             await deployedMilitaryContract.getAddress(),
//             await deployedNukeContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedNavalActionsContract.getAddress(),
//             await deployedAdditionalNavyContract.getAddress()
//           );
          
//           await deployedNavyContract2.settings2(
//             await deployedCountryMinter.getAddress(),
//             await deployedBonusResourcesContract.getAddress(),
//             await deployedNavyContract.getAddress(),
//             await deployedInfrastructureContract.getAddress()
//           );

//         console.log("navy contract 2 settings");

//         await deployedNavalActionsContract.settings(
//             await deployedNavalBlockadeContract.getAddress(),
//             await deployedBreakBlocadeContract.getAddress(),
//             await deployedNavalAttackContract.getAddress(),
//             await deployedKeeperContract.getAddress(),
//             await deployedNavyContract.getAddress(),
//             await deployedNavyContract2.getAddress(),
//             await deployedCountryMinter.getAddress()
//           );

//         console.log("naval actions contract settings");

//         await deployedAdditionalNavyContract.settings(
//             await deployedNavyContract.getAddress(),
//             await deployedNavalActionsContract.getAddress(),
//             await deployedMilitaryContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedNavyContract2.getAddress(),
//             await deployedNavalBlockadeContract.getAddress(),
//             await deployedBreakBlocadeContract.getAddress(),
//             await deployedNavalAttackContract.getAddress()
//           );

//         console.log("additional navy contract settings");

//         await deployedNavalBlockadeContract.settings(
//             await deployedNavyContract.getAddress(),
//             await deployedAdditionalNavyContract.getAddress(),
//             await deployedNavalActionsContract.getAddress(),
//             await deployedWarContract.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedKeeperContract.getAddress(),
//             await deployedBreakBlocadeContract.getAddress(),
//             await deployedBillsContract.getAddress()
//           );

//         console.log("naval blockade contract settings");

//         await deployedBreakBlocadeContract.settings(
//             await deployedCountryMinter.getAddress(),
//             await deployedNavalBlockadeContract.getAddress(),
//             await deployedNavyContract.getAddress(),
//             await deployedWarContract.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedNavalActionsContract.getAddress(),
//             await deployedNavyContract2.getAddress(),
//             await deployedAdditionalNavyContract.getAddress()
//           );

//         console.log("break blockade contract settings");

//         await deployedNavalAttackContract.settings(
//             await deployedNavyContract.getAddress(),
//             await deployedWarContract.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedNavalActionsContract.getAddress(),
//             await deployedNavyContract2.getAddress(),
//             await deployedAdditionalNavyContract.getAddress(),
//             await deployedCountryMinter.getAddress()
//           );

//         console.log("naval attack contract settings");

//         await deployedNukeContract.settings(
//             await deployedCountryMinter.getAddress(),
//             await deployedWarContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedImprovementsContract3.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedNavyContract.getAddress(),
//             await deployedMissilesContract.getAddress(),
//             await deployedKeeperContract.getAddress()
//           );
          
//           await deployedNukeContract.settings2(
//             await deployedCountryParametersContract.getAddress()
//           );

//         console.log("nuke contract settings");

//         await deployedResourcesContract.settings(
//             await deployedInfrastructureContract.getAddress(),
//             await deployedImprovementsContract2.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedBonusResourcesContract.getAddress(),
//             await deployedSenateContract.getAddress(),
//             await deployedTechnologyMarketContract.getAddress(),
//             await deployedCountryParametersContract.getAddress()
//           );
          
//           await deployedBonusResourcesContract.settings(
//             await deployedInfrastructureContract.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedResourcesContract.getAddress(),
//             await deployedCrimeContract.getAddress()
//           );

//         console.log("resources contract settings");

//         await deployedSenateContract.settings(
//             await deployedCountryMinter.getAddress(),
//             await deployedCountryParametersContract.getAddress(),
//             await deployedWondersContract3.getAddress(),
//             await deployedKeeperContract.getAddress(),
//             await deployedResourcesContract.getAddress()
//           );

//         console.log("senate contract settings");

//         await deployedSpyContract.settings(
//             await deployedSpyOperationsContract.getAddress(),
//             await deployedTreasuryContract.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedImprovementsContract2.getAddress(),
//             await deployedWondersContract1.getAddress()
//           );

//         console.log("spy contract settings");

//         await deployedSpyOperationsContract.settings(
//             await deployedInfrastructureContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedMilitaryContract.getAddress(),
//             await deployedNationStrengthContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedWondersContract2.getAddress(),
//             await deployedTreasuryContract.getAddress(),
//             await deployedCountryParametersContract.getAddress(),
//             await deployedMissilesContract.getAddress(),
//             await deployedCountryMinter.getAddress()
//             );

//         await deployedSpyOperationsContract.settings2(
//             await deployedKeeperContract.getAddress(),
//             await deployedSpyContract.getAddress()
//             );

//         console.log("spy operations contract settings");

//         await deployedTaxesContract.settings1(
//             await deployedCountryMinter.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedTreasuryContract.getAddress(),
//             await deployedImprovementsContract1.getAddress(),
//             await deployedImprovementsContract2.getAddress(),
//             await deployedImprovementsContract3.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedAdditionalTaxesContract.getAddress(),
//             await deployedBonusResourcesContract.getAddress(),
//             await deployedKeeperContract.getAddress(),
//             await deployedEnvironmentContract.getAddress()
//           );
          
//           await deployedTaxesContract.settings2(
//             await deployedCountryParametersContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedWondersContract2.getAddress(),
//             await deployedWondersContract3.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedResourcesContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedMilitaryContract.getAddress(),
//             await deployedCrimeContract.getAddress(),
//             await deployedNavalBlockadeContract.getAddress()
//           );

//         console.log("taxes contract settings");

//         await deployedAdditionalTaxesContract.settings(
//             await deployedCountryParametersContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedWondersContract2.getAddress(),
//             await deployedWondersContract3.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedResourcesContract.getAddress(),
//             await deployedMilitaryContract.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedBonusResourcesContract.getAddress()
//           );
          
//           await deployedAdditionalTaxesContract.settings2(
//             await deployedImprovementsContract2.getAddress(),
//             await deployedImprovementsContract3.getAddress(),
//             await deployedForcesContract.getAddress()
//           );

//         console.log("additional taxes contract settings");

//         await deployedTechnologyMarketContract.settings(
//             await deployedResourcesContract.getAddress(),
//             await deployedImprovementsContract3.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedWondersContract2.getAddress(),
//             await deployedWondersContract3.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedTreasuryContract.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedBonusResourcesContract.getAddress(),
//             await deployedCrimeContract.getAddress()
//           );

//         console.log("technology market contract settings");

//         await deployedTreasuryContract.settings1(
//             await deployedWarBucks.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedWondersContract2.getAddress(),
//             await deployedWondersContract3.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedImprovementsContract1.getAddress(),
//             await deployedImprovementsContract2.getAddress(),
//             await deployedImprovementsContract3.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedInfrastructureContract.getAddress()
//           );
          
//           await deployedTreasuryContract.settings2(
//             await deployedGroundBattleContract.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedKeeperContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedNavyContract.getAddress(),
//             await deployedFightersContract.getAddress(),
//             await deployedBombersContract.getAddress(),
//             await deployedAidContract.getAddress(),
//             await deployedTaxesContract.getAddress(),
//             await deployedBillsContract.getAddress(),
//             await deployedSpyOperationsContract.getAddress()
//           );
          
//           await deployedTreasuryContract.settings3(
//             await deployedNavyContract2.getAddress(),
//             await deployedMissilesContract.getAddress(),
//             await deployedInfrastructureMarketContract.getAddress(),
//             await deployedLandMarketContract.getAddress(),
//             await deployedTechnologyMarketContract.getAddress(),
//             await deployedFightersMarketplace1.getAddress(),
//             await deployedFightersMarketplace2.getAddress(),
//             await deployedBombersMarketplace1.getAddress(),
//             await deployedBombersMarketplace2.getAddress(),
//             await deployedCountryParametersContract.getAddress(),
//             await deployedSpyContract.getAddress()
//           );
          
//         console.log("treasury contract settings");

//         await deployedWarContract.settings(
//             await deployedCountryMinter.getAddress(),
//             await deployedNationStrengthContract.getAddress(),
//             await deployedMilitaryContract.getAddress(),
//             await deployedBreakBlocadeContract.getAddress(),
//             await deployedNavalAttackContract.getAddress(),
//             await deployedAirBattleContract.getAddress(),
//             await deployedGroundBattleContract.getAddress(),
//             await deployedCruiseMissileContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedKeeperContract.getAddress()
//           );
          
//           await deployedWarContract.settings2(
//             await deployedTreasuryContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedNavalBlockadeContract.getAddress(),
//             await deployedNukeContract.getAddress()
//           );

//         console.log("war contract settings");

//         await deployedWondersContract1.settings(
//             await deployedTreasuryContract.getAddress(),
//             await deployedWondersContract2.getAddress(),
//             await deployedWondersContract3.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedCountryMinter.getAddress()
//           );

//         console.log("wonders contract 1 settings");

//         await deployedWondersContract2.settings(
//             await deployedTreasuryContract.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedWondersContract3.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedResourcesContract.getAddress()
//           );

//         console.log("wonders contract 2 settings");

//         await deployedWondersContract3.settings(
//             await deployedTreasuryContract.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedForcesContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedWondersContract2.getAddress(),
//             await deployedWondersContract4.getAddress(),
//             await deployedCountryMinter.getAddress(),
//             await deployedResourcesContract.getAddress()
//           );

//         console.log("wonders contract 3 settings");

//         await deployedWondersContract4.settings(
//             await deployedTreasuryContract.getAddress(),
//             await deployedImprovementsContract2.getAddress(),
//             await deployedImprovementsContract3.getAddress(),
//             await deployedImprovementsContract4.getAddress(),
//             await deployedInfrastructureContract.getAddress(),
//             await deployedWondersContract1.getAddress(),
//             await deployedWondersContract3.getAddress(),
//             await deployedCountryMinter.getAddress()
//           );
          

//         console.log("wonders contract 4 settings");

//         await deployedMessenger.settings(
//             await deployedCountryMinter.getAddress()
//           );
    
//         console.log("messenger settings");
    
//         console.log("settings initiated");
    
//         if(chainId == 31337 || chainId == 1337) {
//             if (!vrfCoordinatorV2Mock) {
//                 throw new Error("vrfCoordinatorV2Mock is undefined.");
//             }
//             await vrfCoordinatorV2Mock.addConsumer(subscriptionId, resourcescontract.address);
//             await vrfCoordinatorV2Mock.addConsumer(subscriptionId, countryparameterscontract.address);
//             await vrfCoordinatorV2Mock.addConsumer(subscriptionId, spyoperationscontract.address);
//             await vrfCoordinatorV2Mock.addConsumer(subscriptionId, cruisemissilecontract.address);
//             await vrfCoordinatorV2Mock.addConsumer(subscriptionId, nukecontract.address);
//             await vrfCoordinatorV2Mock.addConsumer(subscriptionId, airbattlecontract.address);
//             await vrfCoordinatorV2Mock.addConsumer(subscriptionId, groundbattlecontract.address);
//             await vrfCoordinatorV2Mock.addConsumer(subscriptionId, navalattackcontract.address);
//             await vrfCoordinatorV2Mock.addConsumer(subscriptionId, navalblockadecontract.address);
//             await vrfCoordinatorV2Mock.addConsumer(subscriptionId, breakblockadecontract.address);
    
//         }
    
//         const eaPath = "external_adapters/Contracts";
    
//         if(chainId == 31337) {
//             const contractMetadataLocation = `${eaPath}/contract-metadata.json`;
//             let contractMetadata : any;
            
//             let countryMinterArtifact = await artifacts.readArtifact("CountryMinter");
//             let countryMinterAbi = countryMinterArtifact.abi;
    
//             let warbucksArtifact = await artifacts.readArtifact("WarBucks");
//             let warbucksAbi = warbucksArtifact.abi;
    
//             let St8craftGovTokenArtifact = await artifacts.readArtifact("St8craftGovToken")
//             let St8craftGovTokenAbi = St8craftGovTokenArtifact.abi
    
//             let AidContractArtifact = await artifacts.readArtifact("AidContract")
//             let AidContractAbi = AidContractArtifact.abi
    
//             let AirBattleArtifact = await artifacts.readArtifact("AirBattleContract")
//             let airbattleAbi = AirBattleArtifact.abi
    
//             let AdditionalAirBattleArtifact = await artifacts.readArtifact("AdditionalAirBattle")
//             let additionalairbattleAbi = AdditionalAirBattleArtifact.abi
    
//             let BillsContractArtifact = await artifacts.readArtifact("BillsContract")
//             let billsAbi = BillsContractArtifact.abi
    
//             let BombersContractArtifact = await artifacts.readArtifact("BombersContract")
//             let bombersAbi = BombersContractArtifact.abi
    
//             let BombersMarketplace1Artifact = await artifacts.readArtifact("BombersMarketplace1")
//             let bombersmarketplace1Abi = BombersMarketplace1Artifact.abi
    
//             let BombersMarketplace2Artifact = await artifacts.readArtifact("BombersMarketplace2")
//             let bombersmarketplace2Abi = BombersMarketplace2Artifact.abi
    
//             let CountryParametersContractArtifact = await artifacts.readArtifact("CountryParametersContract")
//             let countryParametersAbi = CountryParametersContractArtifact.abi
    
//             let AllianceManagerArtifact = await artifacts.readArtifact("AllianceManager")
//             let allianceManagerAbi = AllianceManagerArtifact.abi
    
//             let CrimeContractArtifact = await artifacts.readArtifact("CrimeContract")
//             let crimeAbi = CrimeContractArtifact.abi
    
//             let CruiseMissileContractArtifact = await artifacts.readArtifact("CruiseMissileContract")
//             let cruiseMissileAbi = CruiseMissileContractArtifact.abi
    
//             let EnvironmentContractArtifact = await artifacts.readArtifact("EnvironmentContract")
//             let environmentAbi = EnvironmentContractArtifact.abi
    
//             let FightersContractArtifact = await artifacts.readArtifact("FightersContract")
//             let fightersAbi = FightersContractArtifact.abi
    
//             let FighterLossesArtifact = await artifacts.readArtifact("FighterLosses")
//             let fighterLossesAbi = FighterLossesArtifact.abi
    
//             let FightersMarketplace1Artifact = await artifacts.readArtifact("FightersMarketplace1")
//             let fightersmarketplace1Abi = FightersMarketplace1Artifact.abi
    
//             let FightersMarketplace2Artifact = await artifacts.readArtifact("FightersMarketplace2")
//             let fightersmarketplace2Abi = FightersMarketplace2Artifact.abi
    
//             let forcesArtifact = await artifacts.readArtifact("ForcesContract");
//             let forcesAbi = forcesArtifact.abi;
    
//             let MissilesContractArtifact = await artifacts.readArtifact("MissilesContract");
//             let missilesAbi = MissilesContractArtifact.abi;
    
//             let GroundBattleArtifact = await artifacts.readArtifact("GroundBattleContract");
//             let groundBattleAbi = GroundBattleArtifact.abi;
    
//             let ImprovementsContract1Artifact = await artifacts.readArtifact("ImprovementsContract1");
//             let improvements1Abi = ImprovementsContract1Artifact.abi;
    
//             let ImprovementsContract2Artifact = await artifacts.readArtifact("ImprovementsContract2");
//             let improvements2Abi = ImprovementsContract2Artifact.abi;
    
//             let ImprovementsContract3Artifact = await artifacts.readArtifact("ImprovementsContract3");
//             let improvements3Abi = ImprovementsContract3Artifact.abi;
    
//             let ImprovementsContract4Artifact = await artifacts.readArtifact("ImprovementsContract4");
//             let improvements4Abi = ImprovementsContract4Artifact.abi;
    
//             let InfrastructureContractArtifact = await artifacts.readArtifact("InfrastructureContract");
//             let infrastructureAbi = InfrastructureContractArtifact.abi;
    
//             let InfrastructureMarketplaceArtifact = await artifacts.readArtifact("InfrastructureMarketContract");
//             let infrastructureMarketAbi = InfrastructureMarketplaceArtifact.abi;
    
//             let KeeperContractArtifact = await artifacts.readArtifact("KeeperContract");
//             let keeperAbi = KeeperContractArtifact.abi;
    
//             let LandMarketContractArtifact = await artifacts.readArtifact("LandMarketContract");
//             let landMarketAbi = LandMarketContractArtifact.abi;
    
//             let MilitaryContractArtifact = await artifacts.readArtifact("MilitaryContract");
//             let militaryAbi = MilitaryContractArtifact.abi;
    
//             let NationStrengthContractArtifact = await artifacts.readArtifact("NationStrengthContract");
//             let nationStrengthAbi = NationStrengthContractArtifact.abi;
    
//             let NavyContractArtifact = await artifacts.readArtifact("NavyContract");
//             let navyAbi = NavyContractArtifact.abi;
    
//             let NavyContract2Artifact = await artifacts.readArtifact("NavyContract2");
//             let navy2Abi = NavyContract2Artifact.abi;
    
//             let NavalActionsContractArtifact = await artifacts.readArtifact("NavalActionsContract");
//             let navalActionsAbi = NavalActionsContractArtifact.abi;
    
//             let AdditionalNavyContractArtifact = await artifacts.readArtifact("AdditionalNavyContract");
//             let additionalNavyAbi = AdditionalNavyContractArtifact.abi;
    
//             let NavalBlockadeContractArtifact = await artifacts.readArtifact("NavalBlockadeContract");
//             let navalBlockadeAbi = NavalBlockadeContractArtifact.abi;
    
//             let BreakBlocadeContractArtifact = await artifacts.readArtifact("BreakBlocadeContract");
//             let breakBlockadeAbi = BreakBlocadeContractArtifact.abi;
    
//             let NavalAttackContractArtifact = await artifacts.readArtifact("NavalAttackContract");
//             let navalAttackAbi = NavalAttackContractArtifact.abi;
    
//             let NukeContractArtifact = await artifacts.readArtifact("NukeContract");
//             let nukeAbi = NukeContractArtifact.abi;
    
//             let ResourcesContractArtifact = await artifacts.readArtifact("ResourcesContract");
//             let resourcesAbi = ResourcesContractArtifact.abi;
    
//             let BonusResourcesContractArtifact = await artifacts.readArtifact("BonusResourcesContract");
//             let bonusResourcesAbi = BonusResourcesContractArtifact.abi;
    
//             let SenateContractArtifact = await artifacts.readArtifact("SenateContract");
//             let senateAbi = SenateContractArtifact.abi;
    
//             let SpyContractArtifact = await artifacts.readArtifact("SpyContract");
//             let spycontractAbi = SpyContractArtifact.abi;
    
//             let SpyOperationsContractArtifact = await artifacts.readArtifact("SpyOperationsContract");
//             let spyOperationAbi = SpyOperationsContractArtifact.abi;
    
//             let TaxesContractArtifact = await artifacts.readArtifact("TaxesContract");
//             let taxesAbi = TaxesContractArtifact.abi;
    
//             let AdditionalTaxesContractArtifact = await artifacts.readArtifact("AdditionalTaxesContract");
//             let additionalTaxesAbi = AdditionalTaxesContractArtifact.abi;
    
//             let TechnologyMarketContractArtifact = await artifacts.readArtifact("TechnologyMarketContract");
//             let technologyAbi = TechnologyMarketContractArtifact.abi;
    
//             let treasuryArtifact = await artifacts.readArtifact("TreasuryContract");
//             let treasuryAbi = treasuryArtifact.abi;
    
//             let warArtifact = await artifacts.readArtifact("WarContract");
//             let warAbi = warArtifact.abi;
    
//             let Wonders1Artifact = await artifacts.readArtifact("WondersContract1");
//             let wonders1Abi = Wonders1Artifact.abi;
    
//             let Wonders2Artifact = await artifacts.readArtifact("WondersContract2");
//             let wonders2Abi = Wonders2Artifact.abi;
    
//             let Wonders3Artifact = await artifacts.readArtifact("WondersContract3");
//             let wonders3Abi = Wonders3Artifact.abi;
    
//             let Wonders4Artifact = await artifacts.readArtifact("WondersContract4");
//             let wonders4Abi = Wonders4Artifact.abi;
    
//             let MessengerArtifact = await artifacts.readArtifact("Messenger");
//             let messengerAbi = MessengerArtifact.abi;
    
//             // Read Contract Metadata
//             try {
//               if (fs.existsSync(contractMetadataLocation)) {
//                 contractMetadata = fs.readFileSync(contractMetadataLocation).toString();
//               } else {
//                 contractMetadata = "{}";
//               }
//             } catch (e) {
//               console.log(e);
//             }
//             contractMetadata = JSON.parse(contractMetadata);
            
//             if(chainId == 31337) {
//                 contractMetadata.HARDHAT = {
//                     ...contractMetadata.HARDHAT,
//                     countryminter: {
//                         address: countryminter.address,
//                         ABI: countryMinterAbi,
//                     },
//                     forcescontract: {
//                         address: forcescontract.address,
//                         ABI: forcesAbi,
//                     },
//                     nationstrengthcontract: {
//                         address: nationstrengthcontract.address,
//                         ABI: nationStrengthAbi,
//                     },
//                     treasurycontract: {
//                         address: treasurycontract.address,
//                         ABI: treasuryAbi,
//                     },
//                     spyoperationscontract: {
//                         address: spyoperationscontract.address,
//                         ABI: spyOperationAbi,
//                     },
//                     groundbattlecontract: {
//                         address: groundbattlecontract.address,
//                         ABI: groundBattleAbi,
//                     }
//                 }
//             } else if (chainId == 4002) {
//                 contractMetadata.TESTNET = {
//                     ...contractMetadata.TESTNET,
//                     countryminter: {
//                         address: countryminter.address,
//                         ABI: countryMinterAbi,
//                     },
//                     forcescontract: {
//                         address: forcescontract.address,
//                         ABI: forcesAbi,
//                     },
//                     nationstrengthcontract: {
//                         address: nationstrengthcontract.address,
//                         ABI: nationStrengthAbi,
//                     },
//                     treasurycontract: {
//                         address: treasurycontract.address,
//                         ABI: treasuryAbi,
//                     },
//                     spyoperationscontract: {
//                         address: spyoperationscontract.address,
//                         ABI: spyOperationAbi,
//                     }
//                 };
//             }
    
//             fs.writeFileSync(
//               contractMetadataLocation,
//               JSON.stringify(contractMetadata, null, 2)
//             );
    
//             const scriptMetadataLocation = `script-metadata.json`;
//             let scriptMetadata : any;
    
//             try {
//                 if (fs.existsSync(scriptMetadataLocation)) {
//                     scriptMetadata = fs.readFileSync(scriptMetadataLocation).toString();
//                 } else {
//                     scriptMetadata = "{}";
//                 }
//             } catch (e) {
//                 console.log(e);
//             }
    
//             scriptMetadata = JSON.parse(scriptMetadata);
        
//             scriptMetadata.HARDHAT = {
//                 ...scriptMetadata.HARDHAT,
//                 countryminter: {
//                     address: countryminter.address,
//                     ABI: countryMinterAbi,
//                 },
//                 warbucks: {
//                     address: warbucks.address,
//                     ABI: warbucksAbi,
//                 },
//                 st8craftgovtoken: {
//                     address: st8craftgovtoken.address,
//                     ABI: St8craftGovTokenAbi
//                 },
//                 aidcontract: {
//                     address: aidcontract.address,
//                     ABI: AidContractAbi
//                 },
//                 airbattlecontract: {
//                     address: airbattlecontract.address,
//                     ABI: airbattleAbi
//                 },
//                 additionalairbattle: {
//                     address: additionalairbattle.address,
//                     ABI: additionalairbattleAbi
//                 },
//                 billscontract: {
//                     address: billscontract.address,
//                     ABI: billsAbi
//                 },
//                 bomberscontract: {
//                     address: bomberscontract.address,
//                     ABI: bombersAbi
//                 },
//                 bombersmarketplace1: {
//                     address: bombersmarketplace1.address,
//                     ABI: bombersmarketplace1Abi
//                 },
//                 bombersmarketplace2: {
//                     address: bombersmarketplace2.address,
//                     ABI: bombersmarketplace2Abi
//                 },
//                 countryparameterscontract: {
//                     address: countryparameterscontract.address,
//                     ABI: countryParametersAbi
//                 },
//                 alliancemanger: {
//                     address: allianceManager.address,
//                     ABI: allianceManagerAbi
//                 },
//                 crimecontract: {
//                     address: crimecontract.address,
//                     ABI: crimeAbi
//                 },
//                 cruisemissilecontract: {
//                     address: cruisemissilecontract.address,
//                     ABI: cruiseMissileAbi
//                 },
//                 environmentcontract: {
//                     address: environmentcontract.address,
//                     ABI: environmentAbi
//                 },
//                 fighterscontract: {
//                     address: fighterscontract.address,
//                     ABI: fightersAbi
//                 },
//                 fighterlosses: {
//                     address: fighterlosses.address,
//                     ABI: fighterLossesAbi
//                 },
//                 fightersmarketplace1: {
//                     address: fightersmarketplace1.address,
//                     ABI: fightersmarketplace1Abi
//                 },
//                 fightersmarketplace2: {
//                     address: fightersmarketplace2.address,
//                     ABI: fightersmarketplace2Abi
//                 },
//                 forcescontract: {
//                     address: forcescontract.address,
//                     ABI: forcesAbi,
//                 },
//                 missilescontract: {
//                     address: missilescontract.address,
//                     ABI: missilesAbi,
//                 },
//                 groundbattlecontract: {
//                     address: groundbattlecontract.address,
//                     ABI: groundBattleAbi,
//                 },
//                 improvementscontract1: {
//                     address: improvementscontract1.address,
//                     ABI: improvements1Abi,
//                 },
//                 improvementscontract2: {
//                     address: improvementscontract2.address,
//                     ABI: improvements2Abi,
//                 },
//                 improvementscontract3: {
//                     address: improvementscontract3.address,
//                     ABI: improvements3Abi,
//                 },
//                 improvementscontract4: {
//                     address: improvementscontract4.address,
//                     ABI: improvements4Abi,
//                 },
//                 infrastructurecontract: {
//                     address: infrastructurecontract.address,
//                     ABI: infrastructureAbi,
//                 },
//                 infrastructuremarketplace: {
//                     address: infrastructuremarketplace.address,
//                     ABI: infrastructureMarketAbi,
//                 },
//                 keepercontract: {
//                     address: keepercontract.address,
//                     ABI: keeperAbi,
//                 },
//                 landmarketcontract: {
//                     address: landmarketcontract.address,
//                     ABI: landMarketAbi,
//                 },
//                 militarycontract: {
//                     address: militarycontract.address,
//                     ABI: militaryAbi,
//                 },
//                 nationstrengthcontract: {
//                     address: nationstrengthcontract.address,
//                     ABI: nationStrengthAbi,
//                 },
//                 navycontract: {
//                     address: navycontract.address,
//                     ABI: navyAbi,
//                 },
//                 navycontract2: {
//                     address: navycontract2.address,
//                     ABI: navy2Abi,
//                 },
//                 navalactionscontract: {
//                     address: navalactionscontract.address,
//                     ABI: navalActionsAbi,
//                 },
//                 additionalnavycontract: {
//                     address: additionalnavycontract.address,
//                     ABI: additionalNavyAbi,
//                 },
//                 navalblockadecontract: {
//                     address: navalblockadecontract.address,
//                     ABI: navalBlockadeAbi,
//                 },
//                 breakblockadecontract: {
//                     address: breakblockadecontract.address,
//                     ABI: breakBlockadeAbi,
//                 },
//                 navalattackcontract: {
//                     address: navalattackcontract.address,
//                     ABI: navalAttackAbi,
//                 },
//                 nukecontract: {
//                     address: nukecontract.address,
//                     ABI: nukeAbi,
//                 },
//                 resourcescontract: {
//                     address: resourcescontract.address,
//                     ABI: resourcesAbi,
//                 },
//                 bonusresourcescontract: {
//                     address: bonusresourcescontract.address,
//                     ABI: bonusResourcesAbi,
//                 },
//                 senatecontract: {
//                     address: senatecontract.address,
//                     ABI: senateAbi,
//                 },
//                 spycontract: {
//                     address: spycontract.address,
//                     ABI: spycontractAbi,
//                 },
//                 spyoperationscontract: {
//                     address: spyoperationscontract.address,
//                     ABI: spyOperationAbi,
//                 },
//                 taxescontract: {
//                     address: taxescontract.address,
//                     ABI: taxesAbi,
//                 },
//                 additionaltaxescontract: {
//                     address: additionaltaxescontract.address,
//                     ABI: additionalTaxesAbi,
//                 },
//                 technologymarketcontract: {
//                     address: technologymarketcontrat.address,
//                     ABI: technologyAbi,
//                 },
//                 treasurycontract: {
//                     address: treasurycontract.address,
//                     ABI: treasuryAbi,
//                 },
//                 warcontract: {
//                     address: warcontract.address,
//                     ABI: warAbi,
//                 },
//                 wonderscontract1: {
//                     address: wonderscontract1.address,
//                     ABI: wonders1Abi,
//                 },
//                 wonderscontract2: {
//                     address: wonderscontract2.address,
//                     ABI: wonders2Abi,
//                 },
//                 wonderscontract3: {
//                     address: wonderscontract3.address,
//                     ABI: wonders3Abi,
//                 },
//                 wonderscontract4: {
//                     address: wonderscontract4.address,
//                     ABI: wonders4Abi,
//                 },
//                 messenger: {
//                     address: messenger.address,
//                     ABI: messengerAbi
//                 }
//             };
//             fs.writeFileSync(
//                 scriptMetadataLocation,
//                 JSON.stringify(scriptMetadata, null, 2)
//             );
//         }

//     } else if (chainId === 84532) {
//         const provider = await new ethers.providers.JsonRpcProvider("https://sepolia.base.org");

//         const transport = await TransportNodeHid.create();

//         console.log("Connecting to Ledger...");
//         console.log(transport)

//         const ledgerSigner = new LedgerSigner(transport, provider, "m/44'/60'/0'/0/0");

//         console.log("ledgerSigner", ledgerSigner);

//         const deployer = await ledgerSigner.getAddress();

//         console.log("Using Ledger address:", deployer);
//         const WarBucksFactory = await ethers.getContractFactory("WarBucks");
//         const connectedWarBucksFactory = await WarBucksFactory.connect(ledgerSigner);
//         const deployedWarBucks = await connectedWarBucksFactory.deploy(INITIAL_SUPPLY_WARBUCKS);
//         await deployedWarBucks.deployed();
//         console.log("WarBucks deployed at:", deployedWarBucks.address);
    
//         const St8craftGovTokenFactory = await ethers.getContractFactory("St8craftGovToken", ledgerSigner);
//         const connectedSt8craftGovToken = await St8craftGovTokenFactory.connect(ledgerSigner);
//         const deployedSt8craftGovToken = await connectedSt8craftGovToken.deploy();
//         await deployedSt8craftGovToken.deployed();
//         console.log("St8craftGovToken deployed at:", deployedSt8craftGovToken.address);
    
//         const AidContractFactory = await ethers.getContractFactory("AidContract", ledgerSigner);
//         const connecteddAidContract = await AidContractFactory.connect(ledgerSigner)
//         const deployedAidContract = await connecteddAidContract.deploy();     
//         await deployedAidContract.deployed();
//         console.log("AidContract deployed at:", deployedAidContract.address);
    
//         const AirBattleContractFactory = await ethers.getContractFactory("AirBattleContract", ledgerSigner);
//         const connectedAirBattleContract = await AirBattleContractFactory.connect(ledgerSigner)
//         const deployedAirBattleContract = await connectedAirBattleContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
//         await deployedAirBattleContract.deployed();
//         console.log("AirBattleContract deployed at:", deployedAirBattleContract.address);
    
//         const AdditionalAirBattleFactory = await ethers.getContractFactory("AdditionalAirBattle", ledgerSigner);
//         const connectedAdditionalAirBattle = await AdditionalAirBattleFactory.connect(ledgerSigner)
//         const deployedAdditionalAirBattle = await connectedAdditionalAirBattle.deploy();
//         await deployedAdditionalAirBattle.deployed();
//         console.log("AdditionalAirBattle deployed at:", deployedAdditionalAirBattle.address);
    
//         const BillsContractFactory = await ethers.getContractFactory("BillsContract", ledgerSigner);
//         const connectedBillsContract = await BillsContractFactory.connect(ledgerSigner)
//         const deployedBillsContract = await connectedBillsContract.deploy();
//         await deployedBillsContract.deployed();
//         console.log("BillsContract deployed at:", deployedBillsContract.address);
    
//         const BombersContractFactory = await ethers.getContractFactory("BombersContract", ledgerSigner);
//         const connectedBombersContract = await BombersContractFactory.connect(ledgerSigner)
//         const deployedBombersContract = await connectedBombersContract.deploy()
//         await deployedBombersContract.deployed();
//         console.log("BombersContract deployed at:", deployedBombersContract.address);
    
//         const BombersMarketplace1Factory = await ethers.getContractFactory("BombersMarketplace1", ledgerSigner);
//         const connectedBombersMarketplace1 = await BombersMarketplace1Factory.connect(ledgerSigner)
//         const deployedBombersMarketplace1 = await connectedBombersMarketplace1.deploy();
//         await deployedBombersMarketplace1.deployed();
//         console.log("BombersMarketplace1 deployed at:", deployedBombersMarketplace1.address);
    
//         const BombersMarketplace2Factory = await ethers.getContractFactory("BombersMarketplace2", ledgerSigner);
//         const connectedBombersMarketplace2 = await BombersMarketplace2Factory.connect(ledgerSigner);
//         const deployedBombersMarketplace2 = await connectedBombersMarketplace2.deploy();
//         await deployedBombersMarketplace2.deployed();
//         console.log("BombersMarketplace2 deployed at:", deployedBombersMarketplace2.address);
    
//         const CountryMinterFactory = await ethers.getContractFactory("CountryMinter", ledgerSigner);
//         const connectedCountryMinter = await CountryMinterFactory.connect(ledgerSigner);
//         const deployedCountryMinter = await connectedCountryMinter.deploy();
//         await deployedCountryMinter.deployed();
//         console.log("CountryMinter deployed at:", deployedCountryMinter.address);
    
//         const CountryParametersContractFactory = await ethers.getContractFactory("CountryParametersContract", ledgerSigner);
//         const connectedCountryParametersContract = await CountryParametersContractFactory.connect(ledgerSigner)
//         const deployedCountryParametersContract = await connectedCountryParametersContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
//         await deployedCountryParametersContract.deployed();
//         console.log("CountryParametersContract deployed at:", deployedCountryParametersContract.address);
    
//         const AllianceManagerFactory = await ethers.getContractFactory("AllianceManager", ledgerSigner);
//         const connectedAllianceManager = await AllianceManagerFactory.connect(ledgerSigner);
//         const deployedAllianceManager = await connectedAllianceManager.deploy();
//         await deployedAllianceManager.deployed();
//         console.log("AllianceManager deployed at:", deployedAllianceManager.address);
    
//         const CrimeContractFactory = await ethers.getContractFactory("CrimeContract", ledgerSigner);
//         const connectedCrimeContract = await CrimeContractFactory.connect(ledgerSigner)
//         const deployedCrimeContract = await connectedCrimeContract.deploy()
//         await deployedCrimeContract.deployed();
//         console.log("CrimeContract deployed at:", deployedCrimeContract.address);
    
//         const CruiseMissileContractFactory = await ethers.getContractFactory("CruiseMissileContract", ledgerSigner);
//         const connectedCruiseMissileContract = await CruiseMissileContractFactory.connect(ledgerSigner)
//         const deployedCruiseMissileContract = await connectedCruiseMissileContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
//         await deployedCruiseMissileContract.deployed();
//         console.log("CruiseMissileContract deployed at:", deployedCruiseMissileContract.address);
    
//         const EnvironmentContractFactory = await ethers.getContractFactory("EnvironmentContract", ledgerSigner);
//         const connectedEnvironmentContract = await EnvironmentContractFactory.connect(ledgerSigner)
//         const deployedEnvironmentContract = await connectedEnvironmentContract.deploy();
//         await deployedEnvironmentContract.deployed();
//         console.log("EnvironmentContract deployed at:", deployedEnvironmentContract.address);
    
//         const FightersContractFactory = await ethers.getContractFactory("FightersContract", ledgerSigner);
//         const connectedFightersContract = await FightersContractFactory.connect(ledgerSigner);
//         const deployedFightersContract = await connectedFightersContract.deploy();
//         await deployedFightersContract.deployed();
//         console.log("FightersContract deployed at:", deployedFightersContract.address);
    
//         const FighterLossesFactory = await ethers.getContractFactory("FighterLosses", ledgerSigner);
//         const connectedFighterLosses = await FighterLossesFactory.connect(ledgerSigner);
//         const deployedFighterLosses = await connectedFighterLosses.deploy()
//         await deployedFighterLosses.deployed();
//         console.log("FighterLosses deployed at:", deployedFighterLosses.address);
    
//         const FightersMarketplace1Factory = await ethers.getContractFactory("FightersMarketplace1", ledgerSigner);
//         const connectedFightersMarketplace1 = await FightersMarketplace1Factory.connect(ledgerSigner);
//         const deployedFightersMarketplace1 = await connectedFightersMarketplace1.deploy()
//         await deployedFightersMarketplace1.deployed();
//         console.log("FightersMarketplace1 deployed at:", deployedFightersMarketplace1.address);
    
//         const FightersMarketplace2Factory = await ethers.getContractFactory("FightersMarketplace2", ledgerSigner);
//         const connectedFightersMarketplace2 = await FightersMarketplace2Factory.connect(ledgerSigner);
//         const deployedFightersMarketplace2 = await connectedFightersMarketplace2.deploy();
//         await deployedFightersMarketplace2.deployed();
//         console.log("FightersMarketplace2 deployed at:", deployedFightersMarketplace2.address);
    
//         const ForcesContractFactory = await ethers.getContractFactory("ForcesContract", ledgerSigner);
//         const connectedForcesContract = await ForcesContractFactory.connect(ledgerSigner);
//         const deployedForcesContract = await connectedForcesContract.deploy();
//         await deployedForcesContract.deployed();
//         console.log("ForcesContract deployed at:", deployedForcesContract.address);
    
//         const SpyContractFactory = await ethers.getContractFactory("SpyContract", ledgerSigner);
//         const connectedSpyContract = await SpyContractFactory.connect(ledgerSigner);
//         const deployedSpyContract = await connectedSpyContract.deploy()
//         await deployedSpyContract.deployed();
//         console.log("SpyContract deployed at:", deployedSpyContract.address);
    
//         const MissilesContractFactory = await ethers.getContractFactory("MissilesContract", ledgerSigner);
//         const connectedMissilesContract = await MissilesContractFactory.connect(ledgerSigner);
//         const deployedMissilesContract = await connectedMissilesContract.deploy();
//         await deployedMissilesContract.deployed();
//         console.log("MissilesContract deployed at:", deployedMissilesContract.address);
    
//         const GroundBattleContractFactory = await ethers.getContractFactory("GroundBattleContract", ledgerSigner);
//         const connectedGroundBattleContract = await GroundBattleContractFactory.connect(ledgerSigner)
//         const deployedGroundBattleContract = await connectedGroundBattleContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
//         await deployedGroundBattleContract.deployed();
//         console.log("GroundBattleContract deployed at:", deployedGroundBattleContract.address);
    
//         const ImprovementsContract1Factory = await ethers.getContractFactory("ImprovementsContract1", ledgerSigner);
//         const connectedImprovementsContract1 = await ImprovementsContract1Factory.connect(ledgerSigner);
//         const deployedImprovementsContract1 = await connectedImprovementsContract1.deploy();
//         await deployedImprovementsContract1.deployed();
//         console.log("ImprovementsContract1 deployed at:", deployedImprovementsContract1.address);
    
//         const ImprovementsContract2Factory = await ethers.getContractFactory("ImprovementsContract2", ledgerSigner);
//         const connectedImprovementsContract2 = await ImprovementsContract2Factory.connect(ledgerSigner);
//         const deployedImprovementsContract2 = await connectedImprovementsContract2.deploy();
//         await deployedImprovementsContract2.deployed();
//         console.log("ImprovementsContract2 deployed at:", deployedImprovementsContract2.address);
    
//         const ImprovementsContract3Factory = await ethers.getContractFactory("ImprovementsContract3", ledgerSigner);
//         const connectedImprovementsContract3 = await ImprovementsContract3Factory.connect(ledgerSigner);
//         const deployedImprovementsContract3 = await connectedImprovementsContract3.deploy();
//         await deployedImprovementsContract3.deployed();
//         console.log("ImprovementsContract3 deployed at:", deployedImprovementsContract3.address);
    
//         const ImprovementsContract4Factory = await ethers.getContractFactory("ImprovementsContract4", ledgerSigner);
//         const connectedImprovementsContract4 = await ImprovementsContract4Factory.connect(ledgerSigner);
//         const deployedImprovementsContract4 = await connectedImprovementsContract4.deploy();        
//         await deployedImprovementsContract4.deployed();
//         console.log("ImprovementsContract4 deployed at:", deployedImprovementsContract4.address);
    
//         const InfrastructureContractFactory = await ethers.getContractFactory("InfrastructureContract", ledgerSigner);
//         const connectedInfrastructureContract = await InfrastructureContractFactory.connect(ledgerSigner)
//         const deployedInfrastructureContract = await connectedInfrastructureContract.deploy();
//         await deployedInfrastructureContract.deployed();
//         console.log("InfrastructureContract deployed at:", deployedInfrastructureContract.address);
    
//         const InfrastructureMarketContractFactory = await ethers.getContractFactory("InfrastructureMarketContract", ledgerSigner);
//         const connectedInfrastructureMarketContract = await InfrastructureMarketContractFactory.connect(ledgerSigner);
//         const deployedInfrastructureMarketContract = await connectedInfrastructureMarketContract.deploy();
//         await deployedInfrastructureMarketContract.deployed();
//         console.log("InfrastructureMarketContract deployed at:", deployedInfrastructureMarketContract.address);
    
//         const KeeperContractFactory = await ethers.getContractFactory("KeeperContract", ledgerSigner);
//         const connectedKeeperContract = await KeeperContractFactory.connect(ledgerSigner);
//         const deployedKeeperContract = await connectedKeeperContract.deploy()
//         await deployedKeeperContract.deployed();
//         console.log("KeeperContract deployed at:", deployedKeeperContract.address);
    
//         const LandMarketContractFactory = await ethers.getContractFactory("LandMarketContract", ledgerSigner);
//         const connectedLandMarketContract = await LandMarketContractFactory.connect(ledgerSigner);
//         const deployedLandMarketContract = await connectedLandMarketContract.deploy();
//         await deployedLandMarketContract.deployed();
//         console.log("LandMarketContract deployed at:", deployedLandMarketContract.address);
    
//         const MilitaryContractFactory = await ethers.getContractFactory("MilitaryContract", ledgerSigner);
//         const connectedMilitaryContract = await MilitaryContractFactory.connect(ledgerSigner);
//         const deployedMilitaryContract = await connectedMilitaryContract.deploy();
//         await deployedMilitaryContract.deployed();
//         console.log("MilitaryContract deployed at:", deployedMilitaryContract.address);
    
//         const NationStrengthContractFactory = await ethers.getContractFactory("NationStrengthContract", ledgerSigner);
//         const connectedNationStrengthContract = await NationStrengthContractFactory.connect(ledgerSigner);
//         const deployedNationStrengthContract = await connectedNationStrengthContract.deploy();
//         await deployedNationStrengthContract.deployed();
//         console.log("NationStrengthContract deployed at:", deployedNationStrengthContract.address);
    
//         const NavyContractFactory = await ethers.getContractFactory("NavyContract", ledgerSigner);
//         const connectedNavyContract = await NavyContractFactory.connect(ledgerSigner);
//         const deployedNavyContract = await connectedNavyContract.deploy();
//         await deployedNavyContract.deployed();
//         console.log("NavyContract deployed at:", deployedNavyContract.address);
    
//         const NavyContract2Factory = await ethers.getContractFactory("NavyContract2", ledgerSigner);
//         const connectedNavyContract2 = await NavyContract2Factory.connect(ledgerSigner);
//         const deployedNavyContract2 = await connectedNavyContract2.deploy();
//         await deployedNavyContract2.deployed();
//         console.log("NavyContract2 deployed at:", deployedNavyContract2.address);
    
//         const AdditionalNavyContractFactory = await ethers.getContractFactory("AdditionalNavyContract", ledgerSigner);
//         const connectedAdditionalNavyContract = await AdditionalNavyContractFactory.connect(ledgerSigner);
//         const deployedAdditionalNavyContract = await connectedAdditionalNavyContract.deploy();
//         await deployedAdditionalNavyContract.deployed();
//         console.log("AdditionalNavyContract deployed at:", deployedAdditionalNavyContract.address);
    
//         const NavalActionsContractFactory = await ethers.getContractFactory("NavalActionsContract", ledgerSigner);
//         const connectedNavalActionsContract = await NavalActionsContractFactory.connect(ledgerSigner);
//         const deployedNavalActionsContract = await connectedNavalActionsContract.deploy();
//         await deployedNavalActionsContract.deployed();
//         console.log("NavalActionsContract deployed at:", deployedNavalActionsContract.address);
    
//         const NavalBlockadeContractFactory = await ethers.getContractFactory("NavalBlockadeContract", ledgerSigner);
//         const connectedNavalBlockadeContract = await NavalBlockadeContractFactory.connect(ledgerSigner)
//         const deployedNavalBlockadeContract = await connectedNavalBlockadeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
//         await deployedNavalBlockadeContract.deployed();
//         console.log("NavalBlockadeContract deployed at:", deployedNavalBlockadeContract.address);
    
//         const BreakBlocadeContractFactory = await ethers.getContractFactory("BreakBlocadeContract", ledgerSigner);
//         const connectedBreakBlocadeContract = await BreakBlocadeContractFactory.connect(ledgerSigner)
//         const deployedBreakBlocadeContract = await connectedBreakBlocadeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
//         await deployedBreakBlocadeContract.deployed();
//         console.log("BreakBlocadeContract deployed at:", deployedBreakBlocadeContract.address);
    
//         const NavalAttackContractFactory = await ethers.getContractFactory("NavalAttackContract", ledgerSigner);
//         const connectedNavalAttackContract = await NavalAttackContractFactory.connect(ledgerSigner)
//         const deployedNavalAttackContract = await connectedNavalAttackContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
//         await deployedNavalAttackContract.deployed();
//         console.log("NavalAttackContract deployed at:", deployedNavalAttackContract.address);
    
//         const NukeContractFactory = await ethers.getContractFactory("NukeContract", ledgerSigner);
//         const connectedNukeContract = await NukeContractFactory.connect(ledgerSigner)
//         const deployedNukeContract = await connectedNukeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
//         await deployedNukeContract.deployed();
//         console.log("NukeContract deployed at:", deployedNukeContract.address);
    
//         const ResourcesContractFactory = await ethers.getContractFactory("ResourcesContract", ledgerSigner);
//         const connectedResourcesContract = await ResourcesContractFactory.connect(ledgerSigner)
//         const deployedResourcesContract = await connectedResourcesContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
//         await deployedResourcesContract.deployed();
//         console.log("ResourcesContract deployed at:", deployedResourcesContract.address);
    
//         const BonusResourcesContractFactory = await ethers.getContractFactory("BonusResourcesContract", ledgerSigner);
//         const connectedBonusResourcesContract = await BonusResourcesContractFactory.connect(ledgerSigner);
//         const deployedBonusResourcesContract = await connectedBonusResourcesContract.deploy();
//         await deployedBonusResourcesContract.deployed();
//         console.log("BonusResourcesContract deployed at:", deployedBonusResourcesContract.address);
    
//         const SenateContractFactory = await ethers.getContractFactory("SenateContract", ledgerSigner);
//         const connectedSenateContract = await SenateContractFactory.connect(ledgerSigner)
//         const deployedSenateContract = await connectedSenateContract.deploy();
//         await deployedSenateContract.deployed();
//         console.log("SenateContract deployed at:", deployedSenateContract.address);
    
//         const SpyOperationsContractFactory = await ethers.getContractFactory("SpyOperationsContract", ledgerSigner);
//         const connectedSpyOperationsContract = await SpyOperationsContractFactory.connect(ledgerSigner);
//         const deployedSpyOperationsContract = await connectedSpyOperationsContract.deploy();
//         await deployedSpyOperationsContract.deployed();
//         console.log("SpyOperationsContract deployed at:", deployedSpyOperationsContract.address);
    
//         const TaxesContractFactory = await ethers.getContractFactory("TaxesContract", ledgerSigner);
//         const connectedTaxesContract = await TaxesContractFactory.connect(ledgerSigner);
//         const deployedTaxesContract = await connectedTaxesContract.deploy();
//         await deployedTaxesContract.deployed();
//         console.log("TaxesContract deployed at:", deployedTaxesContract.address);
    
//         const AdditionalTaxesContractFactory = await ethers.getContractFactory("AdditionalTaxesContract", ledgerSigner);
//         const connectedAdditionalTaxesContract = await AdditionalTaxesContractFactory.connect(ledgerSigner)
//         const deployedAdditionalTaxesContract = await connectedAdditionalTaxesContract.deploy();
//         await deployedAdditionalTaxesContract.deployed();
//         console.log("AdditionalTaxesContract deployed at:", deployedAdditionalTaxesContract.address);
    
//         const TechnologyMarketContractFactory = await ethers.getContractFactory("TechnologyMarketContract", ledgerSigner);
//         const connectedTechnologyMarketContract = await TechnologyMarketContractFactory.connect(ledgerSigner);
//         const deployedTechnologyMarketContract = await connectedTechnologyMarketContract.deploy();
//         await deployedTechnologyMarketContract.deployed();
//         console.log("TechnologyMarketContract deployed at:", deployedTechnologyMarketContract.address);
    
//         const TreasuryContractFactory = await ethers.getContractFactory("TreasuryContract", ledgerSigner);
//         const connectedTreasuryContract = await TreasuryContractFactory.connect(ledgerSigner);
//         const deployedTreasuryContract = await connectedTreasuryContract.deploy();
//         await deployedTreasuryContract.deployed();
//         console.log("TreasuryContract deployed at:", deployedTreasuryContract.address);
    
//         const WarContractFactory = await ethers.getContractFactory("WarContract", ledgerSigner);
//         const connectedWarContract = await WarContractFactory.connect(ledgerSigner);
//         const deployedWarContract = await connectedWarContract.deploy();
//         await deployedWarContract.deployed();
//         console.log("WarContract deployed at:", deployedWarContract.address);
    
//         const WondersContract1Factory = await ethers.getContractFactory("WondersContract1", ledgerSigner);
//         const connectedWondersContract1 = await WondersContract1Factory.connect(ledgerSigner);
//         const deployedWondersContract1 = await connectedWondersContract1.deploy();
//         await deployedWondersContract1.deployed();
//         console.log("WondersContract1 deployed at:", deployedWondersContract1.address);
    
//         const WondersContract2Factory = await ethers.getContractFactory("WondersContract2", ledgerSigner);
//         const connectedWondersContract2 = await WondersContract2Factory.connect(ledgerSigner);
//         const deployedWondersContract2 = await connectedWondersContract2.deploy();
//         await deployedWondersContract2.deployed();
//         console.log("WondersContract2 deployed at:", deployedWondersContract2.address);
    
//         const WondersContract3Factory = await ethers.getContractFactory("WondersContract3", ledgerSigner);
//         const connectedWondersContract3 = await WondersContract3Factory.connect(ledgerSigner);
//         const deployedWondersContract3 = await connectedWondersContract3.deploy();
//         await deployedWondersContract3.deployed();
//         console.log("WondersContract3 deployed at:", deployedWondersContract3.address);
    
//         const WondersContract4Factory = await ethers.getContractFactory("WondersContract4", ledgerSigner);
//         const connectedWondersContract4 = await WondersContract4Factory.connect(ledgerSigner);
//         const deployedWondersContract4 = await connectedWondersContract4.deploy();
//         await deployedWondersContract4.deployed();
//         console.log("WondersContract4 deployed at:", deployedWondersContract4.address);
    
//         const MessengerFactory = await ethers.getContractFactory("Messenger", ledgerSigner);
//         const connectedMessenger = await MessengerFactory.connect(ledgerSigner);
//         const deployedMessenger = await connectedMessenger.deploy();
//         await deployedMessenger.deployed();
//         console.log("Messenger deployed at:", deployedMessenger.address);


//         const warbucks = deployedWarBucks;
//         const warbucksContract = deployedWarBucks;
//         const st8craftgovtoken = deployedSt8craftGovToken;
//         const aidcontract = deployedAidContract;
//         const airbattlecontract = deployedAirBattleContract;
//         const additionalairbattle = deployedAdditionalAirBattle;
//         const billscontract = deployedBillsContract;
//         const bomberscontract = deployedBombersContract;
//         const bombersmarketplace1 = deployedBombersMarketplace1;
//         const bombersmarketplace2 = deployedBombersMarketplace2;
//         const countryminter = deployedCountryMinter;
//         const countryparameterscontract = deployedCountryParametersContract;
//         const allianceManager = deployedAllianceManager;
//         const crimecontract = deployedCrimeContract;
//         const cruisemissilecontract = deployedCruiseMissileContract;
//         const environmentcontract = deployedEnvironmentContract;
//         const fighterscontract = deployedFightersContract;
//         const fighterlosses = deployedFighterLosses;
//         const fightersmarketplace1 = deployedFightersMarketplace1;
//         const fightersmarketplace2 = deployedFightersMarketplace2;
//         const forcescontract = deployedForcesContract;
//         const spycontract = deployedSpyContract;
//         const missilescontract = deployedMissilesContract;
//         const groundbattlecontract = deployedGroundBattleContract;
//         const improvementscontract1 = deployedImprovementsContract1;
//         const improvementscontract2 = deployedImprovementsContract2;
//         const improvementscontract3 = deployedImprovementsContract3;
//         const improvementscontract4 = deployedImprovementsContract4;
//         const infrastructurecontract = deployedInfrastructureContract;
//         const infrastructuremarketplace = deployedInfrastructureMarketContract;
//         const keepercontract = deployedKeeperContract;
//         const landmarketcontract = deployedLandMarketContract;
//         const militarycontract = deployedMilitaryContract;
//         const nationstrengthcontract = deployedNationStrengthContract;
//         const navycontract = deployedNavyContract;
//         const navycontract2 = deployedNavyContract2;
//         const additionalnavycontract = deployedAdditionalNavyContract;
//         const navalactionscontract = deployedNavalActionsContract;
//         const navalblockadecontract = deployedNavalBlockadeContract;
//         const breakblockadecontract = deployedBreakBlocadeContract;
//         const navalattackcontract = deployedNavalAttackContract;
//         const nukecontract = deployedNukeContract;
//         const resourcescontract = deployedResourcesContract;
//         const bonusresourcescontract = deployedBonusResourcesContract;
//         const senatecontract = deployedSenateContract;
//         const spyoperationscontract = deployedSpyOperationsContract;
//         const taxescontract = deployedTaxesContract;
//         const additionaltaxescontract = deployedAdditionalTaxesContract;
//         const technologymarketcontrat = deployedTechnologyMarketContract;
//         const treasurycontract = deployedTreasuryContract;
//         const warcontract = deployedWarContract;
//         const wonderscontract1 = deployedWondersContract1;
//         const wonderscontract2 = deployedWondersContract2;
//         const wonderscontract3 = deployedWondersContract3;
//         const wonderscontract4 = deployedWondersContract4;
//         const messenger = deployedMessenger;

//         await warbucksContract.settings(
//             treasurycontract.address,
//             countryminter.address
//         )

//         console.log("warbucks settings");
        
//         await deployedAidContract.settings(
//             countryminter.address, 
//             treasurycontract.address, 
//             forcescontract.address, 
//             infrastructurecontract.address, 
//             keepercontract.address, 
//             wonderscontract1.address,
//             senatecontract.address,
//             countryparameterscontract.address)
        
//         console.log("aid contract settings");

//         await deployedAirBattleContract.settings(
//             warcontract.address, 
//             fighterscontract.address, 
//             bomberscontract.address, 
//             infrastructurecontract.address, 
//             forcescontract.address, 
//             fighterlosses.address,
//             countryminter.address,
//             additionalairbattle.address
//         )

//         console.log("air battle contract settings");

//         await deployedAdditionalAirBattle.settings(
//             warcontract.address, 
//             fighterscontract.address, 
//             bomberscontract.address, 
//             infrastructurecontract.address, 
//             forcescontract.address, 
//             fighterlosses.address,
//             countryminter.address,
//             airbattlecontract.address
//         )

//         console.log("additional air battle contract settings");

//         await deployedBillsContract.settings(
//             countryminter.address,
//             treasurycontract.address,
//             wonderscontract1.address,
//             wonderscontract2.address,
//             wonderscontract3.address,
//             wonderscontract4.address,
//             forcescontract.address,
//             fighterscontract.address,
//             navycontract.address,
//             resourcescontract.address)
//         await deployedBillsContract.settings2(
//             improvementscontract1.address,
//             improvementscontract2.address,
//             missilescontract.address,
//             wonderscontract4.address,
//             infrastructurecontract.address,
//             bonusresourcescontract.address,
//             navycontract2.address,
//             countryparameterscontract.address,
//             navalblockadecontract.address
//         )

//         console.log("bills contract settings");
        
//         await deployedBombersContract.settings(
//             countryminter.address, 
//             bombersmarketplace1.address,
//             bombersmarketplace2.address,
//             airbattlecontract.address,
//             treasurycontract.address,
//             fighterscontract.address,
//             infrastructurecontract.address,
//             warcontract.address)

//         console.log("bombers contract settings");

//         await deployedBombersMarketplace1.settings(
//             countryminter.address,
//             bomberscontract.address,
//             fighterscontract.address,
//             fightersmarketplace1.address,
//             infrastructurecontract.address,
//             treasurycontract.address)

//         console.log("bombers marketplace 1 settings");

//         await deployedBombersMarketplace2.settings(
//             countryminter.address,
//             bomberscontract.address,
//             fighterscontract.address,
//             fightersmarketplace1.address,
//             infrastructurecontract.address,
//             treasurycontract.address)
        
//         console.log("bombers marketplace 2 settings");
        
//         await deployedCountryMinter.settings(
//             countryparameterscontract.address,
//             treasurycontract.address,
//             infrastructurecontract.address,
//             resourcescontract.address,
//             missilescontract.address,
//             senatecontract.address,
//             warbucks.address,
//             bonusresourcescontract.address)
//         await deployedCountryMinter.settings2(
//             improvementscontract1.address,
//             improvementscontract2.address,
//             improvementscontract3.address,
//             improvementscontract4.address,
//             wonderscontract1.address,
//             wonderscontract2.address,
//             wonderscontract3.address,
//             wonderscontract4.address)
//         await deployedCountryMinter.settings3(
//             militarycontract.address,
//             forcescontract.address,
//             navycontract.address,
//             navycontract2.address,
//             navalactionscontract.address,
//             fighterscontract.address,
//             bomberscontract.address)
        
//         console.log("country minter settings");
        
//         await deployedCountryParametersContract.settings(
//             spyoperationscontract.address,
//             countryminter.address,
//             senatecontract.address,
//             keepercontract.address,
//             nukecontract.address,
//             groundbattlecontract.address,
//             wonderscontract1.address,
//             treasurycontract.address
//         )

//         console.log("country parameters contract settings");

//         await deployedAllianceManager.settings(
//             countryminter.address
//         )

//         console.log("alliance manager settings");

//         await deployedCrimeContract.settings(
//             infrastructurecontract.address,
//             improvementscontract1.address,
//             improvementscontract2.address,
//             improvementscontract3.address,
//             improvementscontract4.address,
//             countryparameterscontract.address,
//             wonderscontract2.address)
        
//         console.log("crime contract settings");
        
//         await deployedCruiseMissileContract.settings(
//             forcescontract.address,
//             countryminter.address,
//             warcontract.address,
//             infrastructurecontract.address,
//             missilescontract.address)
//         await deployedCruiseMissileContract.settings2(
//             improvementscontract1.address,
//             improvementscontract3.address,
//             improvementscontract4.address,
//             wonderscontract2.address)
        
//         console.log("cruise missile contract settings");

//         await deployedEnvironmentContract.settings(
//             countryminter.address,
//             resourcescontract.address,
//             infrastructurecontract.address,
//             wonderscontract3.address,
//             wonderscontract4.address,
//             forcescontract.address,
//             countryparameterscontract.address,
//             additionaltaxescontract.address,
//             missilescontract.address,
//             nukecontract.address)
//         await deployedEnvironmentContract.settings2(
//             improvementscontract1.address,
//             improvementscontract3.address,
//             improvementscontract4.address,
//             bonusresourcescontract.address)

//         console.log("environment contract settings");
        
//         await deployedFightersContract.settings(
//             countryminter.address,
//             fightersmarketplace1.address,
//             fightersmarketplace2.address,
//             treasurycontract.address,
//             warcontract.address,
//             infrastructurecontract.address,
//             resourcescontract.address,
//             improvementscontract1.address,
//             airbattlecontract.address,
//             wonderscontract1.address,
//             fighterlosses.address)
//         await deployedFightersContract.settings2(
//             navycontract.address,
//             bomberscontract.address)
        
//         console.log("fighters contract settings");
        
//         await deployedFighterLosses.settings(
//             fighterscontract.address,
//             airbattlecontract.address)

//         console.log("fighter losses settings");

//         await deployedFightersMarketplace1.settings(
//             countryminter.address,
//             bomberscontract.address,
//             fighterscontract.address,
//             treasurycontract.address,
//             infrastructurecontract.address,
//             resourcescontract.address,
//             improvementscontract1.address,
//             wonderscontract1.address,
//             wonderscontract4.address,
//             navycontract.address)
//         await deployedFightersMarketplace1.settings2(
//             bonusresourcescontract.address,
//             navycontract2.address
//         )

//         console.log("fighters marketplace 1 settings");
        
//         await deployedFightersMarketplace2.settings(
//             countryminter.address,
//             bomberscontract.address,
//             fighterscontract.address,
//             fightersmarketplace1.address,
//             treasurycontract.address,
//             infrastructurecontract.address,
//             resourcescontract.address,
//             improvementscontract1.address)
        
//         console.log("fighters marketplace 2 settings");
        
//         await deployedForcesContract.settings(
//             treasurycontract.address,
//             aidcontract.address,
//             spyoperationscontract.address,
//             cruisemissilecontract.address,
//             nukecontract.address,
//             airbattlecontract.address,
//             groundbattlecontract.address,
//             warcontract.address)
//         await deployedForcesContract.settings2(
//             infrastructurecontract.address,
//             resourcescontract.address,
//             improvementscontract1.address,
//             improvementscontract2.address,
//             wonderscontract1.address,
//             countryminter.address,
//             keepercontract.address,
//             countryparameterscontract.address)
        
//         console.log("forces contract settings");
        
//         await deployedMissilesContract.settings(
//             treasurycontract.address,
//             spyoperationscontract.address,
//             nukecontract.address,
//             airbattlecontract.address,
//             wonderscontract2.address,
//             nationstrengthcontract.address,
//             infrastructurecontract.address)
//         await deployedMissilesContract.settings2(
//             resourcescontract.address,
//             improvementscontract1.address,
//             wonderscontract1.address,
//             wonderscontract4.address,
//             countryminter.address,
//             keepercontract.address)
        
//         console.log("missiles contract settings");
            
//         await deployedGroundBattleContract.settings(
//             warcontract.address,
//             infrastructurecontract.address,
//             forcescontract.address,
//             treasurycontract.address,
//             countryminter.address,
//             militarycontract.address)
//         await deployedGroundBattleContract.settings2(
//             improvementscontract2.address,
//             improvementscontract4.address,
//             wonderscontract3.address,
//             wonderscontract4.address,
//             additionaltaxescontract.address,
//             countryparameterscontract.address)
        
//         console.log("ground battle contract settings");
        
//         await deployedImprovementsContract1.settings(
//             treasurycontract.address,
//             improvementscontract2.address,
//             improvementscontract3.address,
//             improvementscontract4.address,
//             navycontract.address,
//             additionalnavycontract.address,
//             countryminter.address,
//             wonderscontract1.address,
//             infrastructurecontract.address)
        
//         console.log("improvements contract 1 settings");

//         await deployedImprovementsContract2.settings(
//             treasurycontract.address,
//             forcescontract.address,
//             wonderscontract1.address,
//             countryminter.address,
//             improvementscontract1.address,
//             resourcescontract.address,
//             spycontract.address
//             )
//         console.log("improvements contract 2 settings");
        
//         await deployedImprovementsContract3.settings(
//             treasurycontract.address,
//             additionalnavycontract.address,
//             improvementscontract1.address,
//             improvementscontract2.address,
//             countryminter.address,
//             bonusresourcescontract.address,
//             wonderscontract4.address
//             )
//         console.log("improvements contract 3 settings");
        
//         await deployedImprovementsContract4.settings(
//             treasurycontract.address,
//             forcescontract.address,
//             improvementscontract1.address,
//             improvementscontract2.address,
//             countryminter.address,
//             wonderscontract4.address,
//             resourcescontract.address
//             )
//         console.log("improvements contract 4 settings");
        
//         await deployedInfrastructureContract.settings1(
//             resourcescontract.address,
//             improvementscontract1.address,
//             improvementscontract2.address,
//             improvementscontract3.address,
//             improvementscontract4.address,
//             infrastructuremarketplace.address,
//             technologymarketcontrat.address,
//             landmarketcontract.address,
//             bonusresourcescontract.address
//         )
//         await deployedInfrastructureContract.settings2(
//             wonderscontract1.address,
//             wonderscontract2.address,
//             wonderscontract3.address,
//             wonderscontract4.address,
//             treasurycontract.address,
//             countryparameterscontract.address,
//             forcescontract.address,
//             aidcontract.address
//         )
//         await deployedInfrastructureContract.settings3(
//             spyoperationscontract.address,
//             taxescontract.address,
//             cruisemissilecontract.address,
//             nukecontract.address,
//             airbattlecontract.address,
//             groundbattlecontract.address,
//             countryminter.address,
//             crimecontract.address,
//             countryparameterscontract.address
//         )

//         console.log("infrastructure contract settings");

//         await deployedInfrastructureMarketContract.settings(
//             resourcescontract.address,
//             countryparameterscontract.address,
//             improvementscontract1.address,
//             countryminter.address,
//             wonderscontract2.address,
//             wonderscontract3.address,
//             treasurycontract.address,
//             infrastructurecontract.address,
//             bonusresourcescontract.address
//         )

//         console.log("infrastructure marketplace settings");

//         await deployedLandMarketContract.settings(
//             resourcescontract.address,
//             countryminter.address,
//             infrastructurecontract.address,
//             treasurycontract.address
//         )

//         console.log("land market contract settings");

//         await deployedMilitaryContract.settings(
//             spyoperationscontract.address,
//             countryminter.address,
//             keepercontract.address
//         )

//         console.log("military contract settings");

//         await deployedNationStrengthContract.settings(
//             infrastructurecontract.address,
//             forcescontract.address,
//             fighterscontract.address,
//             bomberscontract.address,
//             navycontract.address,
//             missilescontract.address,
//             navycontract2.address
//         )

//         console.log("nation strength contract settings");

//         await deployedNavyContract.settings(
//             treasurycontract.address,
//             improvementscontract1.address,
//             improvementscontract3.address,
//             improvementscontract4.address,
//             resourcescontract.address,
//             militarycontract.address,
//             nukecontract.address,
//             wonderscontract1.address,
//             navalactionscontract.address,
//             additionalnavycontract.address
//         )
//         await deployedNavyContract.settings2(
//             countryminter.address,
//             bonusresourcescontract.address,
//             navycontract2.address,
//             infrastructurecontract.address
//         )

//         console.log("navy contract settings");

//         await deployedNavyContract2.settings(
//             treasurycontract.address,
//             improvementscontract1.address,
//             improvementscontract3.address,
//             improvementscontract4.address,
//             resourcescontract.address,
//             militarycontract.address,
//             nukecontract.address,
//             wonderscontract1.address,
//             navalactionscontract.address,
//             additionalnavycontract.address
//         )
//         await deployedNavyContract2.settings2(
//             countryminter.address,
//             bonusresourcescontract.address,
//             navycontract.address,
//             infrastructurecontract.address
//         )

//         console.log("navy contract 2 settings");

//         await deployedNavalActionsContract.settings(
//             navalblockadecontract.address,
//             breakblockadecontract.address,
//             navalattackcontract.address,
//             keepercontract.address,
//             navycontract.address,
//             navycontract2.address,
//             countryminter.address
//         )

//         console.log("naval actions contract settings");

//         await deployedAdditionalNavyContract.settings(
//             navycontract.address,
//             navalactionscontract.address,
//             militarycontract.address,
//             wonderscontract1.address,
//             improvementscontract4.address,
//             navycontract2.address,
//             navalblockadecontract.address,
//             breakblockadecontract.address,
//             navalattackcontract.address,
//         )

//         console.log("additional navy contract settings");

//         await deployedNavalBlockadeContract.settings(
//             navycontract.address,
//             additionalnavycontract.address,
//             navalactionscontract.address,
//             warcontract.address,
//             countryminter.address,
//             keepercontract.address,
//             breakblockadecontract.address,
//             billscontract.address
//         )

//         console.log("naval blockade contract settings");

//         await deployedBreakBlocadeContract.settings(
//             countryminter.address,
//             navalblockadecontract.address,
//             navycontract.address,
//             warcontract.address,
//             improvementscontract4.address,
//             navalactionscontract.address,
//             navycontract2.address,
//             additionalnavycontract.address,
//         )

//         console.log("break blockade contract settings");

//         await deployedNavalAttackContract.settings(
//             navycontract.address,
//             warcontract.address,
//             improvementscontract4.address,
//             navalactionscontract.address,
//             navycontract2.address,
//             additionalnavycontract.address,
//             countryminter.address,
//         )

//         console.log("naval attack contract settings");

//         await deployedNukeContract.settings(
//             countryminter.address,
//             warcontract.address,
//             wonderscontract1.address,
//             wonderscontract4.address,
//             improvementscontract3.address,
//             improvementscontract4.address,
//             infrastructurecontract.address,
//             forcescontract.address,
//             navycontract.address,
//             missilescontract.address,
//             keepercontract.address
//         )
//         await deployedNukeContract.settings2(
//             countryparameterscontract.address
//         )

//         console.log("nuke contract settings");

//         await deployedResourcesContract.settings(
//             infrastructurecontract.address,
//             improvementscontract2.address,
//             countryminter.address,
//             bonusresourcescontract.address,
//             senatecontract.address,
//             technologymarketcontrat.address,
//             countryparameterscontract.address
//         )
//         await deployedBonusResourcesContract.settings(
//             infrastructurecontract.address,
//             countryminter.address,
//             resourcescontract.address,
//             crimecontract.address
//         )

//         console.log("resources contract settings");

//         await deployedSenateContract.settings(
//             countryminter.address,
//             countryparameterscontract.address,
//             wonderscontract3.address,
//             keepercontract.address,
//             resourcescontract.address
//         )

//         console.log("senate contract settings");

//         await deployedSpyContract.settings(
//             spyoperationscontract.address,
//             treasurycontract.address,
//             countryminter.address,
//             improvementscontract2.address,
//             wonderscontract1.address
//             )

//         console.log("spy contract settings");

//         await deployedSpyOperationsContract.settings(
//             infrastructurecontract.address,
//             forcescontract.address,
//             militarycontract.address,
//             nationstrengthcontract.address,
//             wonderscontract1.address,
//             wonderscontract2.address,
//             treasurycontract.address,
//             countryparameterscontract.address,
//             missilescontract.address,
//             countryminter.address
//         )
//         await deployedSpyOperationsContract.settings2(
//             keepercontract.address,
//             spycontract.address
//         )

//         console.log("spy operations contract settings");

//         await deployedTaxesContract.settings1(
//             countryminter.address,
//             infrastructurecontract.address,
//             treasurycontract.address,
//             improvementscontract1.address,
//             improvementscontract2.address,
//             improvementscontract3.address,
//             improvementscontract4.address,
//             additionaltaxescontract.address,
//             bonusresourcescontract.address,
//             keepercontract.address,
//             environmentcontract.address
//         )
//         await deployedTaxesContract.settings2(
//             countryparameterscontract.address,
//             wonderscontract1.address,
//             wonderscontract2.address,
//             wonderscontract3.address,
//             wonderscontract4.address,
//             resourcescontract.address,
//             forcescontract.address,
//             militarycontract.address,
//             crimecontract.address,
//             navalblockadecontract.address
//         )

//         console.log("taxes contract settings");

//         await deployedAdditionalTaxesContract.settings(
//             countryparameterscontract.address,
//             wonderscontract1.address,
//             wonderscontract2.address,
//             wonderscontract3.address,
//             wonderscontract4.address,
//             resourcescontract.address,
//             militarycontract.address,
//             infrastructurecontract.address,
//             bonusresourcescontract.address
//         )
//         await deployedAdditionalTaxesContract.settings2(
//             improvementscontract2.address,
//             improvementscontract3.address,
//             forcescontract.address,
//         )

//         console.log("additional taxes contract settings");

//         await deployedTechnologyMarketContract.settings(
//             resourcescontract.address,
//             improvementscontract3.address,
//             infrastructurecontract.address,
//             wonderscontract2.address,
//             wonderscontract3.address,
//             wonderscontract4.address,
//             treasurycontract.address,
//             countryminter.address,
//             bonusresourcescontract.address,
//             crimecontract.address
//         )

//         console.log("technology market contract settings");

//         await deployedTreasuryContract.settings1(
//             warbucks.address,
//             wonderscontract1.address,
//             wonderscontract2.address,
//             wonderscontract3.address,
//             wonderscontract4.address,
//             improvementscontract1.address,
//             improvementscontract2.address,
//             improvementscontract3.address,
//             improvementscontract4.address,
//             infrastructurecontract.address
//         )
//         await deployedTreasuryContract.settings2(
//             groundbattlecontract.address,
//             countryminter.address,
//             keepercontract.address,
//             forcescontract.address,
//             navycontract.address,
//             fighterscontract.address,
//             bomberscontract.address,
//             aidcontract.address,
//             taxescontract.address,
//             billscontract.address,
//             spyoperationscontract.address
//         )
//         await deployedTreasuryContract.settings3(
//             navycontract2.address,
//             missilescontract.address,
//             infrastructuremarketplace.address,
//             landmarketcontract.address,
//             technologymarketcontrat.address,
//             fightersmarketplace1.address,
//             fightersmarketplace2.address,
//             bombersmarketplace1.address,
//             bombersmarketplace2.address,
//             countryparameterscontract.address,
//             spycontract.address
//         )

//         console.log("treasury contract settings");

//         await deployedWarContract.settings(
//             countryminter.address,
//             nationstrengthcontract.address,
//             militarycontract.address,
//             breakblockadecontract.address,
//             navalattackcontract.address,
//             airbattlecontract.address,
//             groundbattlecontract.address,
//             cruisemissilecontract.address,
//             forcescontract.address,
//             wonderscontract1.address,
//             keepercontract.address
//         )
//         await deployedWarContract.settings2(
//             treasurycontract.address,
//             forcescontract.address,
//             navalblockadecontract.address,
//             nukecontract.address
//         )

//         console.log("war contract settings");

//         await deployedWondersContract1.settings(
//             treasurycontract.address,
//             wonderscontract2.address,
//             wonderscontract3.address,
//             wonderscontract4.address,
//             infrastructurecontract.address,
//             countryminter.address
//         )

//         console.log("wonders contract 1 settings");

//         await deployedWondersContract2.settings(
//             treasurycontract.address,
//             infrastructurecontract.address,
//             wonderscontract1.address,
//             wonderscontract3.address,
//             wonderscontract4.address,
//             countryminter.address,
//             resourcescontract.address
//         )

//         console.log("wonders contract 2 settings");

//         await deployedWondersContract3.settings(
//             treasurycontract.address,
//             infrastructurecontract.address,
//             forcescontract.address,
//             wonderscontract1.address,
//             wonderscontract2.address,
//             wonderscontract4.address,
//             countryminter.address,
//             resourcescontract.address
//         )

//         console.log("wonders contract 3 settings");

//         await deployedWondersContract4.settings(
//             treasurycontract.address,
//             improvementscontract2.address,
//             improvementscontract3.address,
//             improvementscontract4.address,
//             infrastructurecontract.address,
//             wonderscontract1.address,
//             wonderscontract3.address,
//             countryminter.address
//         )

//         console.log("wonders contract 4 settings");

//         await deployedMessenger.settings(
//             countryminter.address,
//         )

//         console.log("messenger settings");

//         console.log("settings initiated");
    
//         console.log("✅ All contracts deployed successfully!");
//     }

// }

// export default main

async function main() {
    console.log("Deploying contracts...");

    // Add your deployment logic here
    // For example, you can deploy contracts using ethers.js or hardhat

    console.log("Contracts deployed successfully!");
}
export default main;