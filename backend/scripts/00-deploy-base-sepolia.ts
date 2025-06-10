//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
import { LedgerSigner } from "@ethers-ext/signer-ledger";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { network, artifacts, ethers } from "hardhat"
import { JsonRpcProvider, parseEther, ContractFactory } from "ethers";

import { 
    WarBucks, 
    St8craftGovToken,
    AidContract,
    AirBattleContract,
    AdditionalAirBattle,
    BillsContract,
    BombersContract,
    BombersMarketplace1,
    BombersMarketplace2,
    CountryMinter,
    CountryParametersContract,
    AllianceManager,
    CrimeContract,
    CruiseMissileContract,
    EnvironmentContract,
    FightersContract,
    FighterLosses,
    FightersMarketplace1,
    FightersMarketplace2,
    ForcesContract,
    MissilesContract,
    GroundBattleContract,
    ImprovementsContract1,
    ImprovementsContract2,
    ImprovementsContract3,
    ImprovementsContract4,
    InfrastructureContract,
    InfrastructureMarketContract,
    KeeperContract,
    LandMarketContract,
    MilitaryContract,
    NationStrengthContract,
    NavalActionsContract,
    NavyContract,
    NavyContract2,
    AdditionalNavyContract,
    NavalBlockadeContract,
    BreakBlocadeContract,
    NavalAttackContract,
    NukeContract,
    ResourcesContract,
    SenateContract,
    SpyContract,
    SpyOperationsContract,
    TaxesContract,
    AdditionalTaxesContract,
    TechnologyMarketContract,
    TreasuryContract,
    WarContract,
    WondersContract1,
    WondersContract2,
    WondersContract3,
    WondersContract4,
    VRFConsumerBaseV2,
    VRFCoordinatorV2Mock,
    BonusResourcesContract,
    Messenger
} from "../typechain-types"
import { networkConfig } from "../helper-hardhat-config"
import fs from "fs"
import deployedContracts from '../../frontend/packages/hardhat/deploy/99_generateTsAbis';
import { v4 as uuidv4 } from 'uuid';

async function main () {
    // const { deployments, getNamedAccounts, ethers } = hre as any;
    // const { deploy } = deployments;
    // let { deployer } = await getNamedAccounts();

    let chainId = network.config.chainId

    const FUND_AMOUNT = parseEther("1")

    let provider

    let subscriptionId = 1  
    let vrfCoordinatorV2Address =  "0x20Dc424c5fa468CbB1c702308F0cC9c14DA2825C";
    let gasLane= "0x9e1344a1247c8a1785d0a4681a27152bffdb43666ae5bf7d14d24a5efd44bf71";
    let callbackGasLimit = "2500000";

    if (chainId == 84532) {
        // const BASE_FEE = "250000000000000000" // 0.25 is this the premium in LINK?
        // const GAS_PRICE_LINK = 1e9 // link per gas, is this the gas lane? // 0.000000001 LINK per gas
        // // create VRFV2 Subscription
        // const VRFCoordinatorV2MockFactory = await ethers.getContractFactory("VRFCoordinatorV2Mock") as unknown as ContractFactory;
        // const VRFCoordinatorV2Mock = await VRFCoordinatorV2MockFactory.deploy(BASE_FEE, GAS_PRICE_LINK) as unknown as VRFCoordinatorV2Mock;
        // vrfCoordinatorV2Mock = await VRFCoordinatorV2Mock.waitForDeployment()
        // vrfCoordinatorV2Address = vrfCoordinatorV2Mock.getAddress()
        // const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        // subscriptionId = 1
        // gasLane = networkConfig[31337]["gasLane"]
        // callbackGasLimit =  networkConfig[31337]["callbackGasLimit"] 
        // await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    }

    let signer0
    let signer1
    let signers
    let addrs
    
    // signers = await ethers.getSigners();
    // signer0 = signers[0];
    // signer1 = signers[1];

    let warbucks: WarBucks  
    let st8craftgovtoken: St8craftGovToken
    let aidcontract: AidContract
    let airbattlecontract: AirBattleContract
    let additionalairbattle: AdditionalAirBattle
    let billscontract: BillsContract
    let bombersmarketplace1: BombersMarketplace1
    let bombersmarketplace2: BombersMarketplace2
    let bomberscontract: BombersContract
    let countryminter: CountryMinter
    let countryparameterscontract: CountryParametersContract
    let allianceManager: AllianceManager
    let crimecontract: CrimeContract
    let cruisemissilecontract: CruiseMissileContract
    let environmentcontract: EnvironmentContract
    let fighterscontract: FightersContract
    let fighterlosses: FighterLosses
    let fightersmarketplace1: FightersMarketplace1
    let fightersmarketplace2: FightersMarketplace2
    let forcescontract: ForcesContract
    let missilescontract: MissilesContract
    let groundbattlecontract: GroundBattleContract
    let improvementscontract1: ImprovementsContract1
    let improvementscontract2: ImprovementsContract2
    let improvementscontract3: ImprovementsContract3
    let improvementscontract4: ImprovementsContract4
    let infrastructurecontract: InfrastructureContract
    let infrastructuremarketplace: InfrastructureMarketContract
    let keepercontract: KeeperContract
    let landmarketcontract: LandMarketContract
    let militarycontract: MilitaryContract
    let nationstrengthcontract: NationStrengthContract
    let navalactionscontract: NavalActionsContract
    let navycontract: NavyContract
    let navycontract2: NavyContract2
    let additionalnavycontract: AdditionalNavyContract
    let navalblockadecontract: NavalBlockadeContract
    let breakblockadecontract: BreakBlocadeContract
    let navalattackcontract: NavalAttackContract
    let nukecontract: NukeContract
    let resourcescontract: ResourcesContract
    let bonusresourcescontract: BonusResourcesContract
    let senatecontract: SenateContract
    let spycontract: SpyContract
    let spyoperationscontract: SpyOperationsContract
    let taxescontract: TaxesContract
    let additionaltaxescontract: AdditionalTaxesContract
    let technologymarketcontrat: TechnologyMarketContract
    let treasurycontract: TreasuryContract
    let warcontract: WarContract
    let wonderscontract1: WondersContract1
    let wonderscontract2: WondersContract2
    let wonderscontract3: WondersContract3
    let wonderscontract4: WondersContract4
    let messenger: Messenger

    // console.log("Deploying contracts with account:", deployer);
    const INITIAL_SUPPLY_ST8CRAFT = parseEther("200000000");
    const INITIAL_SUPPLY_WARBUCKS = parseEther("200000000000");

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    if (chainId === 84532) {
             
        const provider = new JsonRpcProvider("https://sepolia.base.org");

        const transport = await TransportNodeHid.create();

        console.log("Connecting to Ledger...");
        console.log(transport)

        const ledgerSigner = new LedgerSigner(transport, provider, "m/44'/60'/0'/0/0");

        console.log("ledgerSigner", ledgerSigner);

        const deployer = await ledgerSigner.getAddress();

        console.log("Using Ledger address:", deployer);

        const warbucksArtifact = await artifacts.readArtifact("WarBucks");  
        const WarBucksFactory = await new ContractFactory(
            warbucksArtifact.abi, 
            warbucksArtifact.bytecode, 
            ledgerSigner
        );
        const deployedWarBucks = await WarBucksFactory.deploy(INITIAL_SUPPLY_WARBUCKS) as unknown as WarBucks;
        await deployedWarBucks.waitForDeployment();
        console.log("WarBucks deployed at:", await deployedWarBucks.getAddress());

        delay(15000)

        const st8craftGovTokenArtifact = await artifacts.readArtifact("St8craftGovToken");
        const St8craftGovTokenFactory = new ContractFactory(
            st8craftGovTokenArtifact.abi,
            st8craftGovTokenArtifact.bytecode,
            ledgerSigner
        );
        const deployedSt8craftGovToken = await St8craftGovTokenFactory.deploy(INITIAL_SUPPLY_ST8CRAFT) as unknown as St8craftGovToken;
        await deployedSt8craftGovToken.waitForDeployment();
        console.log("St8craftGovToken deployed at:", await deployedSt8craftGovToken.getAddress());

        delay(15000)

        const aidContractArtifact = await artifacts.readArtifact("AidContract");
        const AidContractFactory = new ContractFactory(
            aidContractArtifact.abi,
            aidContractArtifact.bytecode,
            ledgerSigner
        );
        const deployedAidContract = await AidContractFactory.deploy() as unknown as AidContract;
        await deployedAidContract.waitForDeployment();
        console.log("AidContract deployed at:", await deployedAidContract.getAddress());

        delay(15000)

        const airBattleArtifact = await artifacts.readArtifact("AirBattleContract");
        const AirBattleContractFactory = new ContractFactory(
            airBattleArtifact.abi,
            airBattleArtifact.bytecode,
            ledgerSigner
        );
        const deployedAirBattleContract = await AirBattleContractFactory.deploy(
            vrfCoordinatorV2Address,
            subscriptionId,
            gasLane,
            callbackGasLimit
        ) as unknown as AirBattleContract;
        await deployedAirBattleContract.waitForDeployment();
        console.log("AirBattleContract deployed at:", await deployedAirBattleContract.getAddress());

        delay(15000)

        const additionalAirBattleArtifact = await artifacts.readArtifact("AdditionalAirBattle");
        const AdditionalAirBattleFactory = new ContractFactory(
            additionalAirBattleArtifact.abi,
            additionalAirBattleArtifact.bytecode,
            ledgerSigner
        );
        
        const deployedAdditionalAirBattle = await AdditionalAirBattleFactory.deploy() as unknown as AdditionalAirBattle;
        await deployedAdditionalAirBattle.waitForDeployment();
        console.log("AdditionalAirBattle deployed at:", await deployedAdditionalAirBattle.getAddress());

        delay(15000)

        const billsArtifact = await artifacts.readArtifact("BillsContract");
        const BillsContractFactory = new ContractFactory(billsArtifact.abi, billsArtifact.bytecode, ledgerSigner);
        const deployedBillsContract = await BillsContractFactory.deploy() as unknown as BillsContract;
        await deployedBillsContract.waitForDeployment();
        console.log("BillsContract deployed at:", await deployedBillsContract.getAddress());

        delay(15000)

        const bombersArtifact = await artifacts.readArtifact("BombersContract");
        const BombersContractFactory = new ContractFactory(bombersArtifact.abi, bombersArtifact.bytecode, ledgerSigner);
        const deployedBombersContract = await BombersContractFactory.deploy() as unknown as BombersContract;
        await deployedBombersContract.waitForDeployment();
        console.log("BombersContract deployed at:", await deployedBombersContract.getAddress());

        delay(15000)

        const bombersMarketplace1Artifact = await artifacts.readArtifact("BombersMarketplace1");
        const BombersMarketplace1Factory = new ContractFactory(bombersMarketplace1Artifact.abi, bombersMarketplace1Artifact.bytecode, ledgerSigner);
        const deployedBombersMarketplace1 = await BombersMarketplace1Factory.deploy() as unknown as BombersMarketplace1;
        await deployedBombersMarketplace1.waitForDeployment();
        console.log("BombersMarketplace1 deployed at:", await deployedBombersMarketplace1.getAddress());

        delay(15000)

        const bombersMarketplace2Artifact = await artifacts.readArtifact("BombersMarketplace2");
        const BombersMarketplace2Factory = new ContractFactory(bombersMarketplace2Artifact.abi, bombersMarketplace2Artifact.bytecode, ledgerSigner);
        const deployedBombersMarketplace2 = await BombersMarketplace2Factory.deploy() as unknown as BombersMarketplace2;
        await deployedBombersMarketplace2.waitForDeployment();
        console.log("BombersMarketplace2 deployed at:", await deployedBombersMarketplace2.getAddress());

        delay(15000)

        const countryMinterArtifact = await artifacts.readArtifact("CountryMinter");
        const CountryMinterFactory = new ContractFactory(countryMinterArtifact.abi, countryMinterArtifact.bytecode, ledgerSigner);
        const deployedCountryMinter = await CountryMinterFactory.deploy() as unknown as CountryMinter;
        await deployedCountryMinter.waitForDeployment();
        console.log("CountryMinter deployed at:", await deployedCountryMinter.getAddress());

        delay(15000)

        const countryParametersArtifact = await artifacts.readArtifact("CountryParametersContract");
        const CountryParametersContractFactory = new ContractFactory(countryParametersArtifact.abi, countryParametersArtifact.bytecode, ledgerSigner);
        const deployedCountryParametersContract = await CountryParametersContractFactory.deploy(
        vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit
        ) as unknown as CountryParametersContract;
        await deployedCountryParametersContract.waitForDeployment();
        console.log("CountryParametersContract deployed at:", await deployedCountryParametersContract.getAddress());

        delay(15000)

        const allianceManagerArtifact = await artifacts.readArtifact("AllianceManager");
        const AllianceManagerFactory = new ContractFactory(allianceManagerArtifact.abi, allianceManagerArtifact.bytecode, ledgerSigner);
        const deployedAllianceManager = await AllianceManagerFactory.deploy() as unknown as AllianceManager;
        await deployedAllianceManager.waitForDeployment();
        console.log("AllianceManager deployed at:", await deployedAllianceManager.getAddress());

        delay(15000)

        const crimeContractArtifact = await artifacts.readArtifact("CrimeContract");
        const CrimeContractFactory = new ContractFactory(crimeContractArtifact.abi, crimeContractArtifact.bytecode, ledgerSigner);
        const deployedCrimeContract = await CrimeContractFactory.deploy() as unknown as CrimeContract;
        await deployedCrimeContract.waitForDeployment();
        console.log("CrimeContract deployed at:", await deployedCrimeContract.getAddress());

        delay(15000)

        const cruiseMissileArtifact = await artifacts.readArtifact("CruiseMissileContract");
        const CruiseMissileContractFactory = new ContractFactory(cruiseMissileArtifact.abi, cruiseMissileArtifact.bytecode, ledgerSigner);
        const deployedCruiseMissileContract = await CruiseMissileContractFactory.deploy(
        vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit
        ) as unknown as CruiseMissileContract;
        await deployedCruiseMissileContract.waitForDeployment();
        console.log("CruiseMissileContract deployed at:", await deployedCruiseMissileContract.getAddress());

        delay(15000)

        const environmentArtifact = await artifacts.readArtifact("EnvironmentContract");
        const EnvironmentContractFactory = new ContractFactory(environmentArtifact.abi, environmentArtifact.bytecode, ledgerSigner);
        const deployedEnvironmentContract = await EnvironmentContractFactory.deploy() as unknown as EnvironmentContract;
        await deployedEnvironmentContract.waitForDeployment();
        console.log("EnvironmentContract deployed at:", await deployedEnvironmentContract.getAddress());

        delay(15000)

        const fightersArtifact = await artifacts.readArtifact("FightersContract");
        const FightersContractFactory = new ContractFactory(fightersArtifact.abi, fightersArtifact.bytecode, ledgerSigner);
        const deployedFightersContract = await FightersContractFactory.deploy() as unknown as FightersContract;
        await deployedFightersContract.waitForDeployment();
        console.log("FightersContract deployed at:", await deployedFightersContract.getAddress());

        delay(15000)

        const fighterLossesArtifact = await artifacts.readArtifact("FighterLosses");
        const FighterLossesFactory = new ContractFactory(fighterLossesArtifact.abi, fighterLossesArtifact.bytecode, ledgerSigner);
        const deployedFighterLosses = await FighterLossesFactory.deploy() as unknown as FighterLosses;
        await deployedFighterLosses.waitForDeployment();
        console.log("FighterLosses deployed at:", await deployedFighterLosses.getAddress());

        delay(15000)

        const fightersMarketplace1Artifact = await artifacts.readArtifact("FightersMarketplace1");
        const FightersMarketplace1Factory = new ContractFactory(fightersMarketplace1Artifact.abi, fightersMarketplace1Artifact.bytecode, ledgerSigner);
        const deployedFightersMarketplace1 = await FightersMarketplace1Factory.deploy() as unknown as FightersMarketplace1;
        await deployedFightersMarketplace1.waitForDeployment();
        console.log("FightersMarketplace1 deployed at:", await deployedFightersMarketplace1.getAddress());

        delay(15000)

        const fightersMarketplace2Artifact = await artifacts.readArtifact("FightersMarketplace2");
        const FightersMarketplace2Factory = new ContractFactory(fightersMarketplace2Artifact.abi, fightersMarketplace2Artifact.bytecode, ledgerSigner);
        const deployedFightersMarketplace2 = await FightersMarketplace2Factory.deploy() as unknown as FightersMarketplace2;
        await deployedFightersMarketplace2.waitForDeployment();
        console.log("FightersMarketplace2 deployed at:", await deployedFightersMarketplace2.getAddress());

        delay(15000)

        const forcesContractArtifact = await artifacts.readArtifact("ForcesContract");
        const ForcesContractFactory = new ContractFactory(forcesContractArtifact.abi, forcesContractArtifact.bytecode, ledgerSigner);
        const deployedForcesContract = await ForcesContractFactory.deploy() as unknown as ForcesContract;
        await deployedForcesContract.waitForDeployment();
        console.log("ForcesContract deployed at:", await deployedForcesContract.getAddress());

        delay(15000)

        const spyContractArtifact = await artifacts.readArtifact("SpyContract");
        const SpyContractFactory = new ContractFactory(spyContractArtifact.abi, spyContractArtifact.bytecode, ledgerSigner);
        const deployedSpyContract = await SpyContractFactory.deploy() as unknown as SpyContract;
        await deployedSpyContract.waitForDeployment();
        console.log("SpyContract deployed at:", await deployedSpyContract.getAddress());

        delay(15000)

        const missilesContractArtifact = await artifacts.readArtifact("MissilesContract");
        const MissilesContractFactory = new ContractFactory(missilesContractArtifact.abi, missilesContractArtifact.bytecode, ledgerSigner);
        const deployedMissilesContract = await MissilesContractFactory.deploy() as unknown as MissilesContract;
        await deployedMissilesContract.waitForDeployment();
        console.log("MissilesContract deployed at:", await deployedMissilesContract.getAddress());

        delay(15000)

        const groundBattleArtifact = await artifacts.readArtifact("GroundBattleContract");
        const GroundBattleContractFactory = new ContractFactory(groundBattleArtifact.abi, groundBattleArtifact.bytecode, ledgerSigner);
        const deployedGroundBattleContract = await GroundBattleContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as unknown as GroundBattleContract;
        await deployedGroundBattleContract.waitForDeployment();
        console.log("GroundBattleContract deployed at:", await deployedGroundBattleContract.getAddress());

        delay(15000)

        const improvements1Artifact = await artifacts.readArtifact("ImprovementsContract1");
        const ImprovementsContract1Factory = new ContractFactory(improvements1Artifact.abi, improvements1Artifact.bytecode, ledgerSigner);
        const deployedImprovementsContract1 = await ImprovementsContract1Factory.deploy() as unknown as ImprovementsContract1;
        await deployedImprovementsContract1.waitForDeployment();
        console.log("ImprovementsContract1 deployed at:", await deployedImprovementsContract1.getAddress());

        delay(15000)

        const improvements2Artifact = await artifacts.readArtifact("ImprovementsContract2");
        const ImprovementsContract2Factory = new ContractFactory(improvements2Artifact.abi, improvements2Artifact.bytecode, ledgerSigner);
        const deployedImprovementsContract2 = await ImprovementsContract2Factory.deploy() as unknown as ImprovementsContract2;
        await deployedImprovementsContract2.waitForDeployment();
        console.log("ImprovementsContract2 deployed at:", await deployedImprovementsContract2.getAddress());
        
        delay(15000)

        const improvements3Artifact = await artifacts.readArtifact("ImprovementsContract3");
        const ImprovementsContract3Factory = new ContractFactory(improvements3Artifact.abi, improvements3Artifact.bytecode, ledgerSigner);
        const deployedImprovementsContract3 = await ImprovementsContract3Factory.deploy() as unknown as ImprovementsContract3;
        await deployedImprovementsContract3.waitForDeployment();
        console.log("ImprovementsContract3 deployed at:", await deployedImprovementsContract3.getAddress());

        delay(15000)

        const improvements4Artifact = await artifacts.readArtifact("ImprovementsContract4");
        const ImprovementsContract4Factory = new ContractFactory(improvements4Artifact.abi, improvements4Artifact.bytecode, ledgerSigner);
        const deployedImprovementsContract4 = await ImprovementsContract4Factory.deploy() as unknown as ImprovementsContract4;
        await deployedImprovementsContract4.waitForDeployment();
        console.log("ImprovementsContract4 deployed at:", await deployedImprovementsContract4.getAddress());
    
        delay(15000)

        const infrastructureArtifact = await artifacts.readArtifact("InfrastructureContract");
        const InfrastructureContractFactory = new ContractFactory(infrastructureArtifact.abi, infrastructureArtifact.bytecode, ledgerSigner);
        const deployedInfrastructureContract = await InfrastructureContractFactory.deploy() as unknown as InfrastructureContract;
        await deployedInfrastructureContract.waitForDeployment();
        console.log("InfrastructureContract deployed at:", await deployedInfrastructureContract.getAddress());
        
        delay(15000)

        const infrastructureMarketArtifact = await artifacts.readArtifact("InfrastructureMarketContract");
        const InfrastructureMarketContractFactory = new ContractFactory(infrastructureMarketArtifact.abi, infrastructureMarketArtifact.bytecode, ledgerSigner);
        const deployedInfrastructureMarketContract = await InfrastructureMarketContractFactory.deploy() as unknown as InfrastructureMarketContract;
        await deployedInfrastructureMarketContract.waitForDeployment();
        console.log("InfrastructureMarketContract deployed at:", await deployedInfrastructureMarketContract.getAddress());
        
        delay(15000)

        const keeperArtifact = await artifacts.readArtifact("KeeperContract");
        const KeeperContractFactory = new ContractFactory(keeperArtifact.abi, keeperArtifact.bytecode, ledgerSigner);
        const deployedKeeperContract = await KeeperContractFactory.deploy() as unknown as KeeperContract;
        await deployedKeeperContract.waitForDeployment();
        console.log("KeeperContract deployed at:", await deployedKeeperContract.getAddress());
        
        delay(15000)

        const landMarketArtifact = await artifacts.readArtifact("LandMarketContract");
        const LandMarketContractFactory = new ContractFactory(landMarketArtifact.abi, landMarketArtifact.bytecode, ledgerSigner);
        const deployedLandMarketContract = await LandMarketContractFactory.deploy() as unknown as LandMarketContract;
        await deployedLandMarketContract.waitForDeployment();
        console.log("LandMarketContract deployed at:", await deployedLandMarketContract.getAddress());
        
        delay(15000)

        const militaryArtifact = await artifacts.readArtifact("MilitaryContract");
        const MilitaryContractFactory = new ContractFactory(militaryArtifact.abi, militaryArtifact.bytecode, ledgerSigner);
        const deployedMilitaryContract = await MilitaryContractFactory.deploy() as unknown as MilitaryContract;
        await deployedMilitaryContract.waitForDeployment();
        console.log("MilitaryContract deployed at:", await deployedMilitaryContract.getAddress());
    
        delay(15000)

        const nationStrengthArtifact = await artifacts.readArtifact("NationStrengthContract");
        const NationStrengthContractFactory = new ContractFactory(nationStrengthArtifact.abi, nationStrengthArtifact.bytecode, ledgerSigner);
        const deployedNationStrengthContract = await NationStrengthContractFactory.deploy() as unknown as NationStrengthContract;
        await deployedNationStrengthContract.waitForDeployment();
        console.log("NationStrengthContract deployed at:", await deployedNationStrengthContract.getAddress());
        
        delay(15000)

        const navyArtifact = await artifacts.readArtifact("NavyContract");
        const NavyContractFactory = new ContractFactory(navyArtifact.abi, navyArtifact.bytecode, ledgerSigner);
        const deployedNavyContract = await NavyContractFactory.deploy() as unknown as NavyContract;
        await deployedNavyContract.waitForDeployment();
        console.log("NavyContract deployed at:", await deployedNavyContract.getAddress());
        
        delay(15000)

        const navy2Artifact = await artifacts.readArtifact("NavyContract2");
        const NavyContract2Factory = new ContractFactory(navy2Artifact.abi, navy2Artifact.bytecode, ledgerSigner);
        const deployedNavyContract2 = await NavyContract2Factory.deploy() as unknown as NavyContract2;
        await deployedNavyContract2.waitForDeployment();
        console.log("NavyContract2 deployed at:", await deployedNavyContract2.getAddress());
        
        delay(15000)

        const additionalNavyArtifact = await artifacts.readArtifact("AdditionalNavyContract");
        const AdditionalNavyContractFactory = new ContractFactory(additionalNavyArtifact.abi, additionalNavyArtifact.bytecode, ledgerSigner);
        const deployedAdditionalNavyContract = await AdditionalNavyContractFactory.deploy() as unknown as AdditionalNavyContract;
        await deployedAdditionalNavyContract.waitForDeployment();
        console.log("AdditionalNavyContract deployed at:", await deployedAdditionalNavyContract.getAddress());
        
        delay(15000)

        const navalActionsArtifact = await artifacts.readArtifact("NavalActionsContract");
        const NavalActionsContractFactory = new ContractFactory(navalActionsArtifact.abi, navalActionsArtifact.bytecode, ledgerSigner);
        const deployedNavalActionsContract = await NavalActionsContractFactory.deploy() as unknown as NavalActionsContract;
        await deployedNavalActionsContract.waitForDeployment();
        console.log("NavalActionsContract deployed at:", await deployedNavalActionsContract.getAddress());
        
        delay(15000)

        const navalBlockadeArtifact = await artifacts.readArtifact("NavalBlockadeContract");
        const NavalBlockadeContractFactory = new ContractFactory(navalBlockadeArtifact.abi, navalBlockadeArtifact.bytecode, ledgerSigner);
        const deployedNavalBlockadeContract = await NavalBlockadeContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as unknown as NavalBlockadeContract;
        await deployedNavalBlockadeContract.waitForDeployment();
        console.log("NavalBlockadeContract deployed at:", await deployedNavalBlockadeContract.getAddress());
        
        delay(15000)

        const breakBlocadeArtifact = await artifacts.readArtifact("BreakBlocadeContract");
        const BreakBlocadeContractFactory = new ContractFactory(breakBlocadeArtifact.abi, breakBlocadeArtifact.bytecode, ledgerSigner);
        const deployedBreakBlocadeContract = await BreakBlocadeContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as unknown as BreakBlocadeContract;
        await deployedBreakBlocadeContract.waitForDeployment();
        console.log("BreakBlocadeContract deployed at:", await deployedBreakBlocadeContract.getAddress());
        
        delay(15000)

        const navalAttackArtifact = await artifacts.readArtifact("NavalAttackContract");
        const NavalAttackContractFactory = new ContractFactory(navalAttackArtifact.abi, navalAttackArtifact.bytecode, ledgerSigner);
        const deployedNavalAttackContract = await NavalAttackContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as unknown as NavalAttackContract;
        await deployedNavalAttackContract.waitForDeployment();
        console.log("NavalAttackContract deployed at:", await deployedNavalAttackContract.getAddress());
        
        delay(15000)

        const nukeArtifact = await artifacts.readArtifact("NukeContract");
        const NukeContractFactory = new ContractFactory(nukeArtifact.abi, nukeArtifact.bytecode, ledgerSigner);
        const deployedNukeContract = await NukeContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as unknown as NukeContract;
        await deployedNukeContract.waitForDeployment();
        console.log("NukeContract deployed at:", await deployedNukeContract.getAddress());
        
        delay(15000)

        const resourcesArtifact = await artifacts.readArtifact("ResourcesContract");
        const ResourcesContractFactory = new ContractFactory(resourcesArtifact.abi, resourcesArtifact.bytecode, ledgerSigner);
        const deployedResourcesContract = await ResourcesContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as unknown as ResourcesContract;
        await deployedResourcesContract.waitForDeployment();
        console.log("ResourcesContract deployed at:", await deployedResourcesContract.getAddress());
        
        delay(15000)

        const bonusResourcesArtifact = await artifacts.readArtifact("BonusResourcesContract");
        const BonusResourcesContractFactory = new ContractFactory(bonusResourcesArtifact.abi, bonusResourcesArtifact.bytecode, ledgerSigner);
        const deployedBonusResourcesContract = await BonusResourcesContractFactory.deploy() as unknown as BonusResourcesContract;
        await deployedBonusResourcesContract.waitForDeployment();
        console.log("BonusResourcesContract deployed at:", await deployedBonusResourcesContract.getAddress());
        
        delay(15000)

        const senateArtifact = await artifacts.readArtifact("SenateContract");
        const SenateContractFactory = new ContractFactory(senateArtifact.abi, senateArtifact.bytecode, ledgerSigner);
        const deployedSenateContract = await SenateContractFactory.deploy() as unknown as SenateContract;
        await deployedSenateContract.waitForDeployment();
        console.log("SenateContract deployed at:", await deployedSenateContract.getAddress());
        
        delay(15000)

        const spyOperationsArtifact = await artifacts.readArtifact("SpyOperationsContract");
        const SpyOperationsContractFactory = new ContractFactory(spyOperationsArtifact.abi, spyOperationsArtifact.bytecode, ledgerSigner);
        const deployedSpyOperationsContract = await SpyOperationsContractFactory.deploy() as unknown as SpyOperationsContract;
        await deployedSpyOperationsContract.waitForDeployment();
        console.log("SpyOperationsContract deployed at:", await deployedSpyOperationsContract.getAddress());
        
        delay(15000)

        const taxesArtifact = await artifacts.readArtifact("TaxesContract");
        const TaxesContractFactory = new ContractFactory(taxesArtifact.abi, taxesArtifact.bytecode, ledgerSigner);
        const deployedTaxesContract = await TaxesContractFactory.deploy() as unknown as TaxesContract;
        await deployedTaxesContract.waitForDeployment();
        console.log("TaxesContract deployed at:", await deployedTaxesContract.getAddress());
        
        delay(15000)

        const additionalTaxesArtifact = await artifacts.readArtifact("AdditionalTaxesContract");
        const AdditionalTaxesContractFactory = new ContractFactory(additionalTaxesArtifact.abi, additionalTaxesArtifact.bytecode, ledgerSigner);
        const deployedAdditionalTaxesContract = await AdditionalTaxesContractFactory.deploy() as unknown as AdditionalTaxesContract;
        await deployedAdditionalTaxesContract.waitForDeployment();
        console.log("AdditionalTaxesContract deployed at:", await deployedAdditionalTaxesContract.getAddress());
        
        delay(15000)
    
        const techMarketArtifact = await artifacts.readArtifact("TechnologyMarketContract");
        const TechnologyMarketContractFactory = new ContractFactory(techMarketArtifact.abi, techMarketArtifact.bytecode, ledgerSigner);
        const deployedTechnologyMarketContract = await TechnologyMarketContractFactory.deploy() as unknown as TechnologyMarketContract;
        await deployedTechnologyMarketContract.waitForDeployment();
        console.log("TechnologyMarketContract deployed at:", await deployedTechnologyMarketContract.getAddress());
        
        delay(15000)

        const treasuryArtifact = await artifacts.readArtifact("TreasuryContract");
        const TreasuryContractFactory = new ContractFactory(treasuryArtifact.abi, treasuryArtifact.bytecode, ledgerSigner);
        const deployedTreasuryContract = await TreasuryContractFactory.deploy() as unknown as TreasuryContract;
        await deployedTreasuryContract.waitForDeployment();
        console.log("TreasuryContract deployed at:", await deployedTreasuryContract.getAddress());
        
        delay(15000)

        const warArtifact = await artifacts.readArtifact("WarContract");
        const WarContractFactory = new ContractFactory(warArtifact.abi, warArtifact.bytecode, ledgerSigner);
        const deployedWarContract = await WarContractFactory.deploy() as unknown as WarContract;
        await deployedWarContract.waitForDeployment();
        console.log("WarContract deployed at:", await deployedWarContract.getAddress());
        
        delay(15000)

        const wonders1Artifact = await artifacts.readArtifact("WondersContract1");
        const WondersContract1Factory = new ContractFactory(wonders1Artifact.abi, wonders1Artifact.bytecode, ledgerSigner);
        const deployedWondersContract1 = await WondersContract1Factory.deploy() as unknown as WondersContract1;
        await deployedWondersContract1.waitForDeployment();
        console.log("WondersContract1 deployed at:", await deployedWondersContract1.getAddress());
        
        delay(15000)

        const wonders2Artifact = await artifacts.readArtifact("WondersContract2");
        const WondersContract2Factory = new ContractFactory(wonders2Artifact.abi, wonders2Artifact.bytecode, ledgerSigner);
        const deployedWondersContract2 = await WondersContract2Factory.deploy() as unknown as WondersContract2;
        await deployedWondersContract2.waitForDeployment();
        console.log("WondersContract2 deployed at:", await deployedWondersContract2.getAddress());
        
        delay(15000)

        const wonders3Artifact = await artifacts.readArtifact("WondersContract3");
        const WondersContract3Factory = new ContractFactory(wonders3Artifact.abi, wonders3Artifact.bytecode, ledgerSigner);
        const deployedWondersContract3 = await WondersContract3Factory.deploy() as unknown as WondersContract3;
        await deployedWondersContract3.waitForDeployment();
        console.log("WondersContract3 deployed at:", await deployedWondersContract3.getAddress());
        
        delay(15000)

        const wonders4Artifact = await artifacts.readArtifact("WondersContract4");
        const WondersContract4Factory = new ContractFactory(wonders4Artifact.abi, wonders4Artifact.bytecode, ledgerSigner);
        const deployedWondersContract4 = await WondersContract4Factory.deploy() as unknown as WondersContract4;
        await deployedWondersContract4.waitForDeployment();
        console.log("WondersContract4 deployed at:", await deployedWondersContract4.getAddress());
        
        delay(15000)

        const messengerArtifact = await artifacts.readArtifact("Messenger");
        const MessengerFactory = new ContractFactory(messengerArtifact.abi, messengerArtifact.bytecode, ledgerSigner);
        const deployedMessenger = await MessengerFactory.deploy() as unknown as Messenger;
        await deployedMessenger.waitForDeployment();
        console.log("Messenger deployed at:", await deployedMessenger.getAddress());
        
        delay(15000)

        const warbucks = deployedWarBucks;
        const warbucksContract = deployedWarBucks;
        const st8craftgovtoken = deployedSt8craftGovToken;
        const aidcontract = deployedAidContract;
        const airbattlecontract = deployedAirBattleContract;
        const additionalairbattle = deployedAdditionalAirBattle;
        const billscontract = deployedBillsContract;
        const bomberscontract = deployedBombersContract;
        const bombersmarketplace1 = deployedBombersMarketplace1;
        const bombersmarketplace2 = deployedBombersMarketplace2;
        const countryminter = deployedCountryMinter;
        const countryparameterscontract = deployedCountryParametersContract;
        const allianceManager = deployedAllianceManager;
        const crimecontract = deployedCrimeContract;
        const cruisemissilecontract = deployedCruiseMissileContract;
        const environmentcontract = deployedEnvironmentContract;
        const fighterscontract = deployedFightersContract;
        const fighterlosses = deployedFighterLosses;
        const fightersmarketplace1 = deployedFightersMarketplace1;
        const fightersmarketplace2 = deployedFightersMarketplace2;
        const forcescontract = deployedForcesContract;
        const spycontract = deployedSpyContract;
        const missilescontract = deployedMissilesContract;
        const groundbattlecontract = deployedGroundBattleContract;
        const improvementscontract1 = deployedImprovementsContract1;
        const improvementscontract2 = deployedImprovementsContract2;
        const improvementscontract3 = deployedImprovementsContract3;
        const improvementscontract4 = deployedImprovementsContract4;
        const infrastructurecontract = deployedInfrastructureContract;
        const infrastructuremarketplace = deployedInfrastructureMarketContract;
        const keepercontract = deployedKeeperContract;
        const landmarketcontract = deployedLandMarketContract;
        const militarycontract = deployedMilitaryContract;
        const nationstrengthcontract = deployedNationStrengthContract;
        const navycontract = deployedNavyContract;
        const navycontract2 = deployedNavyContract2;
        const additionalnavycontract = deployedAdditionalNavyContract;
        const navalactionscontract = deployedNavalActionsContract;
        const navalblockadecontract = deployedNavalBlockadeContract;
        const breakblockadecontract = deployedBreakBlocadeContract;
        const navalattackcontract = deployedNavalAttackContract;
        const nukecontract = deployedNukeContract;
        const resourcescontract = deployedResourcesContract;
        const bonusresourcescontract = deployedBonusResourcesContract;
        const senatecontract = deployedSenateContract;
        const spyoperationscontract = deployedSpyOperationsContract;
        const taxescontract = deployedTaxesContract;
        const additionaltaxescontract = deployedAdditionalTaxesContract;
        const technologymarketcontrat = deployedTechnologyMarketContract;
        const treasurycontract = deployedTreasuryContract;
        const warcontract = deployedWarContract;
        const wonderscontract1 = deployedWondersContract1;
        const wonderscontract2 = deployedWondersContract2;
        const wonderscontract3 = deployedWondersContract3;
        const wonderscontract4 = deployedWondersContract4;
        const messenger = deployedMessenger;

        await deployedWarBucks.settings(
            deployedTreasuryContract.getAddress(),
            deployedCountryMinter.getAddress(),
        )

        console.log("warbucks settings");

        delay(15000)

        await deployedAidContract.settings(
            await deployedCountryMinter.getAddress(),
            await deployedTreasuryContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedKeeperContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedSenateContract.getAddress(),
            await deployedCountryParametersContract.getAddress()
          );   
          
          
        console.log("aid contract settings");
 
        delay(15000)

        await deployedAirBattleContract.settings(
            await deployedWarContract.getAddress(),
            await deployedFightersContract.getAddress(),
            await deployedBombersContract.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedFighterLosses.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedAdditionalAirBattle.getAddress()
          );          

        console.log("air battle contract settings");

        delay(15000)

        await deployedAdditionalAirBattle.settings(
            await deployedWarContract.getAddress(),
            await deployedFightersContract.getAddress(),
            await deployedBombersContract.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedFighterLosses.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedAirBattleContract.getAddress()
          );

        console.log("additional air battle contract settings");

        delay(15000)

        await deployedBillsContract.settings(
            await deployedCountryMinter.getAddress(),
            await deployedTreasuryContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedWondersContract2.getAddress(),
            await deployedWondersContract3.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedFightersContract.getAddress(),
            await deployedNavyContract.getAddress(),
            await deployedResourcesContract.getAddress()
          );
          
        console.log("bills contract settings");
          delay(15000)

          await deployedBillsContract.settings2(
            await deployedImprovementsContract1.getAddress(),
            await deployedImprovementsContract2.getAddress(),
            await deployedMissilesContract.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedBonusResourcesContract.getAddress(),
            await deployedNavyContract2.getAddress(),
            await deployedCountryParametersContract.getAddress(),
            await deployedNavalBlockadeContract.getAddress()
          );

          
          
          console.log("bills contract settings");
          delay(15000)
        
        await deployedBombersContract.settings(
            await deployedCountryMinter.getAddress(),
            await deployedBombersMarketplace1.getAddress(),
            await deployedBombersMarketplace2.getAddress(),
            await deployedAirBattleContract.getAddress(),
            await deployedTreasuryContract.getAddress(),
            await deployedFightersContract.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedWarContract.getAddress()
          );

        console.log("bombers contract settings");
        delay(15000)

        await deployedBombersMarketplace1.settings(
            await deployedCountryMinter.getAddress(),
            await deployedBombersContract.getAddress(),
            await deployedFightersContract.getAddress(),
            await deployedFightersMarketplace1.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedTreasuryContract.getAddress()
          );

        console.log("bombers marketplace 1 settings");
        delay(15000)

        await deployedBombersMarketplace2.settings(
            await deployedCountryMinter.getAddress(),
            await deployedBombersContract.getAddress(),
            await deployedFightersContract.getAddress(),
            await deployedFightersMarketplace1.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedTreasuryContract.getAddress()
          );
        
        console.log("bombers marketplace 2 settings");
        delay(15000)
        
        await deployedCountryMinter.settings(
            await deployedCountryParametersContract.getAddress(),
            await deployedTreasuryContract.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedResourcesContract.getAddress(),
            await deployedMissilesContract.getAddress(),
            await deployedSenateContract.getAddress(),
            await deployedWarBucks.getAddress(),
            await deployedBonusResourcesContract.getAddress()
          );

        console.log("country minter settings");
        delay(15000)
          
          await deployedCountryMinter.settings2(
            await deployedImprovementsContract1.getAddress(),
            await deployedImprovementsContract2.getAddress(),
            await deployedImprovementsContract3.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedWondersContract2.getAddress(),
            await deployedWondersContract3.getAddress(),
            await deployedWondersContract4.getAddress()
          );

        console.log("country minter settings 2");
        delay(15000)
          
          await deployedCountryMinter.settings3(
            await deployedMilitaryContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedNavyContract.getAddress(),
            await deployedNavyContract2.getAddress(),
            await deployedNavalActionsContract.getAddress(),
            await deployedFightersContract.getAddress(),
            await deployedBombersContract.getAddress()
          );
        
        console.log("country minter settings");
        delay(15000)
        
        await deployedCountryParametersContract.settings(
            await deployedSpyOperationsContract.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedSenateContract.getAddress(),
            await deployedKeeperContract.getAddress(),
            await deployedNukeContract.getAddress(),
            await deployedGroundBattleContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedTreasuryContract.getAddress()
          );

        console.log("country parameters contract settings");
        delay(15000)

        await deployedAllianceManager.settings(
            await deployedCountryMinter.getAddress()
          );

        console.log("alliance manager settings");
        delay(15000)

        await deployedCrimeContract.settings(
            await deployedInfrastructureContract.getAddress(),
            await deployedImprovementsContract1.getAddress(),
            await deployedImprovementsContract2.getAddress(),
            await deployedImprovementsContract3.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedCountryParametersContract.getAddress(),
            await deployedWondersContract2.getAddress()
          );
        
        console.log("crime contract settings");
        delay(15000)
        
        await deployedCruiseMissileContract.settings(
            await deployedForcesContract.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedWarContract.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedMissilesContract.getAddress()
          );

        console.log("cruise missile contract settings");
        delay(15000)
          
          await deployedCruiseMissileContract.settings2(
            await deployedImprovementsContract1.getAddress(),
            await deployedImprovementsContract3.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedWondersContract2.getAddress()
          );
        
        console.log("cruise missile contract settings");
        delay(15000)

        await deployedEnvironmentContract.settings(
            await deployedCountryMinter.getAddress(),
            await deployedResourcesContract.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedWondersContract3.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedCountryParametersContract.getAddress(),
            await deployedAdditionalTaxesContract.getAddress(),
            await deployedMissilesContract.getAddress(),
            await deployedNukeContract.getAddress()
          );

        console.log("environment contract settings");
        delay(15000)
          
          await deployedEnvironmentContract.settings2(
            await deployedImprovementsContract1.getAddress(),
            await deployedImprovementsContract3.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedBonusResourcesContract.getAddress()
          );

        console.log("environment contract settings");
        delay(15000)
        
        await deployedFightersContract.settings(
            await deployedCountryMinter.getAddress(),
            await deployedFightersMarketplace1.getAddress(),
            await deployedFightersMarketplace2.getAddress(),
            await deployedTreasuryContract.getAddress(),
            await deployedWarContract.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedResourcesContract.getAddress(),
            await deployedImprovementsContract1.getAddress(),
            await deployedAirBattleContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedFighterLosses.getAddress()
          );

        console.log("fighters contract settings");
        delay(15000)
          
          await deployedFightersContract.settings2(
            await deployedNavyContract.getAddress(),
            await deployedBombersContract.getAddress()
          );
        
        console.log("fighters contract settings");
        delay(15000)
        
        await deployedFighterLosses.settings(
            await deployedFightersContract.getAddress(),
            await deployedAirBattleContract.getAddress()
          );

        console.log("fighter losses settings");
        delay(15000)

        await deployedFightersMarketplace1.settings(
            await deployedCountryMinter.getAddress(),
            await deployedBombersContract.getAddress(),
            await deployedFightersContract.getAddress(),
            await deployedTreasuryContract.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedResourcesContract.getAddress(),
            await deployedImprovementsContract1.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedNavyContract.getAddress()
          );

        console.log("fighters marketplace 1 settings");
        delay(15000)
          
          await deployedFightersMarketplace1.settings2(
            await deployedBonusResourcesContract.getAddress(),
            await deployedNavyContract2.getAddress()
          );

        console.log("fighters marketplace 1 settings");
        delay(15000)
        
        await deployedFightersMarketplace2.settings(
            await deployedCountryMinter.getAddress(),
            await deployedBombersContract.getAddress(),
            await deployedFightersContract.getAddress(),
            await deployedFightersMarketplace1.getAddress(),
            await deployedTreasuryContract.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedResourcesContract.getAddress(),
            await deployedImprovementsContract1.getAddress()
          );
        
        console.log("fighters marketplace 2 settings");
        delay(15000)
        
        await deployedForcesContract.settings(
            await deployedTreasuryContract.getAddress(),
            await deployedAidContract.getAddress(),
            await deployedSpyOperationsContract.getAddress(),
            await deployedCruiseMissileContract.getAddress(),
            await deployedNukeContract.getAddress(),
            await deployedAirBattleContract.getAddress(),
            await deployedGroundBattleContract.getAddress(),
            await deployedWarContract.getAddress()
          );

        console.log("forces contract settings");
        delay(15000)
          
          await deployedForcesContract.settings2(
            await deployedInfrastructureContract.getAddress(),
            await deployedResourcesContract.getAddress(),
            await deployedImprovementsContract1.getAddress(),
            await deployedImprovementsContract2.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedKeeperContract.getAddress(),
            await deployedCountryParametersContract.getAddress()
          );
        
        console.log("forces contract settings");
        delay(15000)
        
        await deployedMissilesContract.settings(
            await deployedTreasuryContract.getAddress(),
            await deployedSpyOperationsContract.getAddress(),
            await deployedNukeContract.getAddress(),
            await deployedAirBattleContract.getAddress(),
            await deployedWondersContract2.getAddress(),
            await deployedNationStrengthContract.getAddress(),
            await deployedInfrastructureContract.getAddress()
          );

        console.log("missiles contract settings");
        delay(15000)
          
          await deployedMissilesContract.settings2(
            await deployedResourcesContract.getAddress(),
            await deployedImprovementsContract1.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedKeeperContract.getAddress()
          );
        
        console.log("missiles contract settings");
        delay(15000)
            
        await deployedGroundBattleContract.settings(
            await deployedWarContract.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedTreasuryContract.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedMilitaryContract.getAddress()
          );

        console.log("ground battle contract settings");
        delay(15000)
          
          await deployedGroundBattleContract.settings2(
            await deployedImprovementsContract2.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedWondersContract3.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedAdditionalTaxesContract.getAddress(),
            await deployedCountryParametersContract.getAddress()
          );
        
        console.log("ground battle contract settings");
        delay(15000)
        
        await deployedImprovementsContract1.settings(
            await deployedTreasuryContract.getAddress(),
            await deployedImprovementsContract2.getAddress(),
            await deployedImprovementsContract3.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedNavyContract.getAddress(),
            await deployedAdditionalNavyContract.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedInfrastructureContract.getAddress()
          );
        
        console.log("improvements contract 1 settings");
        delay(15000)

        await deployedImprovementsContract2.settings(
            await deployedTreasuryContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedImprovementsContract1.getAddress(),
            await deployedResourcesContract.getAddress(),
            await deployedSpyContract.getAddress()
          );

        console.log("improvements contract 2 settings");
        delay(15000)
        
        await deployedImprovementsContract3.settings(
            await deployedTreasuryContract.getAddress(),
            await deployedAdditionalNavyContract.getAddress(),
            await deployedImprovementsContract1.getAddress(),
            await deployedImprovementsContract2.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedBonusResourcesContract.getAddress(),
            await deployedWondersContract4.getAddress()
        );

        console.log("improvements contract 3 settings");
        delay(15000)
        
        await deployedImprovementsContract4.settings(
            await deployedTreasuryContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedImprovementsContract1.getAddress(),
            await deployedImprovementsContract2.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedResourcesContract.getAddress()
          );

        console.log("improvements contract 4 settings");
        delay(15000)
        
        await deployedInfrastructureContract.settings1(
            await deployedResourcesContract.getAddress(),
            await deployedImprovementsContract1.getAddress(),
            await deployedImprovementsContract2.getAddress(),
            await deployedImprovementsContract3.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedInfrastructureMarketContract.getAddress(),
            await deployedTechnologyMarketContract.getAddress(),
            await deployedLandMarketContract.getAddress(),
            await deployedBonusResourcesContract.getAddress()
        );

        console.log("infrastructure contract settings 1");
        delay(15000)

        await deployedInfrastructureContract.settings2(
            await deployedWondersContract1.getAddress(),
            await deployedWondersContract2.getAddress(),
            await deployedWondersContract3.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedTreasuryContract.getAddress(),
            await deployedCountryParametersContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedAidContract.getAddress()
        );
        
        console.log("infrastructure contract settings 2");
        delay(15000)

        await deployedInfrastructureContract.settings3(
            await deployedSpyOperationsContract.getAddress(),
            await deployedTaxesContract.getAddress(),
            await deployedCruiseMissileContract.getAddress(),
            await deployedNukeContract.getAddress(),
            await deployedAirBattleContract.getAddress(),
            await deployedGroundBattleContract.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedCrimeContract.getAddress(),
            await deployedCountryParametersContract.getAddress()
        );

        console.log("infrastructure contract settings");
        delay(15000)

        await deployedInfrastructureMarketContract.settings(
            await deployedResourcesContract.getAddress(),
            await deployedCountryParametersContract.getAddress(),
            await deployedImprovementsContract1.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedWondersContract2.getAddress(),
            await deployedWondersContract3.getAddress(),
            await deployedTreasuryContract.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedBonusResourcesContract.getAddress()
          );

        console.log("infrastructure marketplace settings");
        delay(15000)

        await deployedLandMarketContract.settings(
            await deployedResourcesContract.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedTreasuryContract.getAddress()
          );

        console.log("land market contract settings");
        delay(15000)

        await deployedMilitaryContract.settings(
            await deployedSpyOperationsContract.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedKeeperContract.getAddress()
          );

        console.log("military contract settings");
        delay(15000)

        await deployedNationStrengthContract.settings(
            await deployedInfrastructureContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedFightersContract.getAddress(),
            await deployedBombersContract.getAddress(),
            await deployedNavyContract.getAddress(),
            await deployedMissilesContract.getAddress(),
            await deployedNavyContract2.getAddress()
          );

        console.log("nation strength contract settings");
        delay(15000)

        await deployedNavyContract.settings(
            await deployedTreasuryContract.getAddress(),
            await deployedImprovementsContract1.getAddress(),
            await deployedImprovementsContract3.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedResourcesContract.getAddress(),
            await deployedMilitaryContract.getAddress(),
            await deployedNukeContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedNavalActionsContract.getAddress(),
            await deployedAdditionalNavyContract.getAddress()
          );

        console.log("navy contract settings");
        delay(15000)
          
          await deployedNavyContract.settings2(
            await deployedCountryMinter.getAddress(),
            await deployedBonusResourcesContract.getAddress(),
            await deployedNavyContract2.getAddress(),
            await deployedInfrastructureContract.getAddress()
          );

        console.log("navy contract settings");
        delay(15000)

        await deployedNavyContract2.settings(
            await deployedTreasuryContract.getAddress(),
            await deployedImprovementsContract1.getAddress(),
            await deployedImprovementsContract3.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedResourcesContract.getAddress(),
            await deployedMilitaryContract.getAddress(),
            await deployedNukeContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedNavalActionsContract.getAddress(),
            await deployedAdditionalNavyContract.getAddress()
          );

        console.log("navy contract 2 settings");
        delay(15000)
          
          await deployedNavyContract2.settings2(
            await deployedCountryMinter.getAddress(),
            await deployedBonusResourcesContract.getAddress(),
            await deployedNavyContract.getAddress(),
            await deployedInfrastructureContract.getAddress()
          );

        console.log("navy contract 2 settings");
        delay(15000)

        await deployedNavalActionsContract.settings(
            await deployedNavalBlockadeContract.getAddress(),
            await deployedBreakBlocadeContract.getAddress(),
            await deployedNavalAttackContract.getAddress(),
            await deployedKeeperContract.getAddress(),
            await deployedNavyContract.getAddress(),
            await deployedNavyContract2.getAddress(),
            await deployedCountryMinter.getAddress()
          );

        console.log("naval actions contract settings");
        delay(15000)

        await deployedAdditionalNavyContract.settings(
            await deployedNavyContract.getAddress(),
            await deployedNavalActionsContract.getAddress(),
            await deployedMilitaryContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedNavyContract2.getAddress(),
            await deployedNavalBlockadeContract.getAddress(),
            await deployedBreakBlocadeContract.getAddress(),
            await deployedNavalAttackContract.getAddress()
          );

        console.log("additional navy contract settings");
        delay(15000)

        await deployedNavalBlockadeContract.settings(
            await deployedNavyContract.getAddress(),
            await deployedAdditionalNavyContract.getAddress(),
            await deployedNavalActionsContract.getAddress(),
            await deployedWarContract.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedKeeperContract.getAddress(),
            await deployedBreakBlocadeContract.getAddress(),
            await deployedBillsContract.getAddress()
          );

        console.log("naval blockade contract settings");
        delay(15000)

        await deployedBreakBlocadeContract.settings(
            await deployedCountryMinter.getAddress(),
            await deployedNavalBlockadeContract.getAddress(),
            await deployedNavyContract.getAddress(),
            await deployedWarContract.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedNavalActionsContract.getAddress(),
            await deployedNavyContract2.getAddress(),
            await deployedAdditionalNavyContract.getAddress()
          );

        console.log("break blockade contract settings");
        delay(15000)

        await deployedNavalAttackContract.settings(
            await deployedNavyContract.getAddress(),
            await deployedWarContract.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedNavalActionsContract.getAddress(),
            await deployedNavyContract2.getAddress(),
            await deployedAdditionalNavyContract.getAddress(),
            await deployedCountryMinter.getAddress()
          );

        console.log("naval attack contract settings");
        delay(15000)

        await deployedNukeContract.settings(
            await deployedCountryMinter.getAddress(),
            await deployedWarContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedImprovementsContract3.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedNavyContract.getAddress(),
            await deployedMissilesContract.getAddress(),
            await deployedKeeperContract.getAddress()
          );
          
        console.log("nuke contract settings");
        delay(15000)
        
          await deployedNukeContract.settings2(
            await deployedCountryParametersContract.getAddress()
          );

        console.log("nuke contract settings");
        delay(15000)

        await deployedResourcesContract.settings(
            await deployedInfrastructureContract.getAddress(),
            await deployedImprovementsContract2.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedBonusResourcesContract.getAddress(),
            await deployedSenateContract.getAddress(),
            await deployedTechnologyMarketContract.getAddress(),
            await deployedCountryParametersContract.getAddress()
          );

        console.log("resources contract settings");
        delay(15000)
          
          await deployedBonusResourcesContract.settings(
            await deployedInfrastructureContract.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedResourcesContract.getAddress(),
            await deployedCrimeContract.getAddress()
          );

        console.log("resources contract settings");
        delay(15000)

        await deployedSenateContract.settings(
            await deployedCountryMinter.getAddress(),
            await deployedCountryParametersContract.getAddress(),
            await deployedWondersContract3.getAddress(),
            await deployedKeeperContract.getAddress(),
            await deployedResourcesContract.getAddress()
          );

        console.log("senate contract settings");
        delay(15000)

        await deployedSpyContract.settings(
            await deployedSpyOperationsContract.getAddress(),
            await deployedTreasuryContract.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedImprovementsContract2.getAddress(),
            await deployedWondersContract1.getAddress()
          );

        console.log("spy contract settings");
        delay(15000)

        await deployedSpyOperationsContract.settings(
            await deployedInfrastructureContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedMilitaryContract.getAddress(),
            await deployedNationStrengthContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedWondersContract2.getAddress(),
            await deployedTreasuryContract.getAddress(),
            await deployedCountryParametersContract.getAddress(),
            await deployedMissilesContract.getAddress(),
            await deployedCountryMinter.getAddress()
            );

        console.log("spy operations contract settings 1");
        delay(15000)

        await deployedSpyOperationsContract.settings2(
            await deployedKeeperContract.getAddress(),
            await deployedSpyContract.getAddress()
            );

        console.log("spy operations contract settings");
        delay(15000)

        await deployedTaxesContract.settings1(
            await deployedCountryMinter.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedTreasuryContract.getAddress(),
            await deployedImprovementsContract1.getAddress(),
            await deployedImprovementsContract2.getAddress(),
            await deployedImprovementsContract3.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedAdditionalTaxesContract.getAddress(),
            await deployedBonusResourcesContract.getAddress(),
            await deployedKeeperContract.getAddress(),
            await deployedEnvironmentContract.getAddress()
          );

        console.log("taxes contract settings 1");
        delay(15000)
          
          await deployedTaxesContract.settings2(
            await deployedCountryParametersContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedWondersContract2.getAddress(),
            await deployedWondersContract3.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedResourcesContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedMilitaryContract.getAddress(),
            await deployedCrimeContract.getAddress(),
            await deployedNavalBlockadeContract.getAddress()
          );

        console.log("taxes contract settings");
        delay(15000)

        await deployedAdditionalTaxesContract.settings(
            await deployedCountryParametersContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedWondersContract2.getAddress(),
            await deployedWondersContract3.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedResourcesContract.getAddress(),
            await deployedMilitaryContract.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedBonusResourcesContract.getAddress()
          );

        console.log("additional taxes contract settings");
        delay(15000)
          
          await deployedAdditionalTaxesContract.settings2(
            await deployedImprovementsContract2.getAddress(),
            await deployedImprovementsContract3.getAddress(),
            await deployedForcesContract.getAddress()
          );

        console.log("additional taxes contract settings");
        delay(15000)

        await deployedTechnologyMarketContract.settings(
            await deployedResourcesContract.getAddress(),
            await deployedImprovementsContract3.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedWondersContract2.getAddress(),
            await deployedWondersContract3.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedTreasuryContract.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedBonusResourcesContract.getAddress(),
            await deployedCrimeContract.getAddress()
          );

        console.log("technology market contract settings");
        delay(15000)

        await deployedTreasuryContract.settings1(
            await deployedWarBucks.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedWondersContract2.getAddress(),
            await deployedWondersContract3.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedImprovementsContract1.getAddress(),
            await deployedImprovementsContract2.getAddress(),
            await deployedImprovementsContract3.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedInfrastructureContract.getAddress()
          );

        console.log("treasury contract settings 1");
        delay(15000)
          
          await deployedTreasuryContract.settings2(
            await deployedGroundBattleContract.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedKeeperContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedNavyContract.getAddress(),
            await deployedFightersContract.getAddress(),
            await deployedBombersContract.getAddress(),
            await deployedAidContract.getAddress(),
            await deployedTaxesContract.getAddress(),
            await deployedBillsContract.getAddress(),
            await deployedSpyOperationsContract.getAddress()
          );

        console.log("treasury contract settings 2");
        delay(15000)
          
          await deployedTreasuryContract.settings3(
            await deployedNavyContract2.getAddress(),
            await deployedMissilesContract.getAddress(),
            await deployedInfrastructureMarketContract.getAddress(),
            await deployedLandMarketContract.getAddress(),
            await deployedTechnologyMarketContract.getAddress(),
            await deployedFightersMarketplace1.getAddress(),
            await deployedFightersMarketplace2.getAddress(),
            await deployedBombersMarketplace1.getAddress(),
            await deployedBombersMarketplace2.getAddress(),
            await deployedCountryParametersContract.getAddress(),
            await deployedSpyContract.getAddress()
          );
          
        console.log("treasury contract settings");
        delay(15000)

        await deployedWarContract.settings(
            await deployedCountryMinter.getAddress(),
            await deployedNationStrengthContract.getAddress(),
            await deployedMilitaryContract.getAddress(),
            await deployedBreakBlocadeContract.getAddress(),
            await deployedNavalAttackContract.getAddress(),
            await deployedAirBattleContract.getAddress(),
            await deployedGroundBattleContract.getAddress(),
            await deployedCruiseMissileContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedKeeperContract.getAddress()
          );

        console.log("war contract settings");
        delay(15000)
          
          await deployedWarContract.settings2(
            await deployedTreasuryContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedNavalBlockadeContract.getAddress(),
            await deployedNukeContract.getAddress()
          );

        console.log("war contract settings");
        delay(15000)

        await deployedWondersContract1.settings(
            await deployedTreasuryContract.getAddress(),
            await deployedWondersContract2.getAddress(),
            await deployedWondersContract3.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedCountryMinter.getAddress()
          );

        console.log("wonders contract 1 settings");
        delay(15000)

        await deployedWondersContract2.settings(
            await deployedTreasuryContract.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedWondersContract3.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedResourcesContract.getAddress()
          );

        console.log("wonders contract 2 settings");
        delay(15000)

        await deployedWondersContract3.settings(
            await deployedTreasuryContract.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedForcesContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedWondersContract2.getAddress(),
            await deployedWondersContract4.getAddress(),
            await deployedCountryMinter.getAddress(),
            await deployedResourcesContract.getAddress()
          );

        console.log("wonders contract 3 settings");
        delay(15000)

        await deployedWondersContract4.settings(
            await deployedTreasuryContract.getAddress(),
            await deployedImprovementsContract2.getAddress(),
            await deployedImprovementsContract3.getAddress(),
            await deployedImprovementsContract4.getAddress(),
            await deployedInfrastructureContract.getAddress(),
            await deployedWondersContract1.getAddress(),
            await deployedWondersContract3.getAddress(),
            await deployedCountryMinter.getAddress()
          );
          

        console.log("wonders contract 4 settings");
        delay(15000)

        await deployedMessenger.settings(
            await deployedCountryMinter.getAddress()
          );

        console.log("messenger settings");
        delay(15000)

        console.log("settings initiated");
    
        console.log("✅ All contracts deployed successfully!");
    }

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
})