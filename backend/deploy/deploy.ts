//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
import { network, artifacts } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { LedgerSigner } from "@ethersproject/hardware-wallets";

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

    const FUND_AMOUNT = ethers.utils.parseEther("1")

    let provider
    let ledgerSigner

    if (chainId == 31337) {
        const BASE_FEE = "250000000000000000" // 0.25 is this the premium in LINK?
        const GAS_PRICE_LINK = 1e9 // link per gas, is this the gas lane? // 0.000000001 LINK per gas
        // create VRFV2 Subscription
        const VRFCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Mock = await VRFCoordinatorV2Mock.deploy(BASE_FEE, GAS_PRICE_LINK)
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait()
        subscriptionId = transactionReceipt.events[0].args.subId
        gasLane = networkConfig[31337]["gasLane"]
        callbackGasLimit =  networkConfig[31337]["callbackGasLimit"] 
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else if (chainId == 84532) {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
        gasLane = networkConfig[chainId]["gasLane"]
        callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]

        provider = new ethers.providers.JsonRpcProvider("https://sepolia.base.org");

        ledgerSigner = new LedgerSigner(
            provider,
            "default", // or "hid" depending on how you connect
            "m/44'/60'/0'/0/0" // derivation path
        );
    } else {
        // vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        // subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    let signer0
    let signer1
    let signers
    let addrs
    
    signers = await ethers.getSigners();
    signer0 = signers[0];
    signer1 = signers[1];

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

    console.log("Deploying contracts with account:", deployer);

    const INITIAL_SUPPLY_ST8CRAFT = ethers.utils.parseEther("200000000"); 
    const INITIAL_SUPPLY_WARBUCKS = ethers.utils.parseEther("200000000000"); 

    if (chainId === 31337) {

        warbucks = await deploy("WarBucks", { from: deployer, args: [INITIAL_SUPPLY_WARBUCKS], log: true });
        let warbucksContract = await ethers.getContractAt("WarBucks", warbucks.address);

        st8craftgovtoken = await deploy("St8craftGovToken", { from: deployer, args: [INITIAL_SUPPLY_ST8CRAFT], log: true });
        let st8craftgovtokenContract = await ethers.getContractAt("St8craftGovToken", st8craftgovtoken.address);

        aidcontract = await deploy("AidContract", { from: deployer, args: [], log: true });
        let deployedAidContract = await ethers.getContractAt("AidContract", aidcontract.address);

        airbattlecontract = await deploy("AirBattleContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
        let deployedAirBattleContract = await ethers.getContractAt("AirBattleContract", airbattlecontract.address);

        additionalairbattle = await deploy("AdditionalAirBattle", { from: deployer, args: [], log: true });
        let deployedAdditionalAirBattle = await ethers.getContractAt("AdditionalAirBattle", additionalairbattle.address);

        billscontract = await deploy("BillsContract", { from: deployer, args: [], log: true });
        let deployedBillsContract = await ethers.getContractAt("BillsContract", billscontract.address);
        
        bomberscontract = await deploy("BombersContract", { from: deployer, args: [], log: true });
        let deployedBombersContract = await ethers.getContractAt("BombersContract", bomberscontract.address);

        bombersmarketplace1 = await deploy("BombersMarketplace1", { from: deployer, args: [], log: true });
        let deployedBombersMarketplace1 = await ethers.getContractAt("BombersMarketplace1", bombersmarketplace1.address);

        bombersmarketplace2 = await deploy("BombersMarketplace2", { from: deployer, args: [], log: true });
        let deployedBombersMarketplace2 = await ethers.getContractAt("BombersMarketplace2", bombersmarketplace2.address);

        countryminter = await deploy("CountryMinter", { from: deployer, args: [], log: true });
        let deployedCountryMinter = await ethers.getContractAt("CountryMinter", countryminter.address);

        countryparameterscontract = await deploy("CountryParametersContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
        let deployedCountryParametersContract = await ethers.getContractAt("CountryParametersContract", countryparameterscontract.address);

        allianceManager = await deploy("AllianceManager", { from: deployer, args: [], log: true });
        let deployedAllianceManager = await ethers.getContractAt("AllianceManager", allianceManager.address);
        
        crimecontract = await deploy("CrimeContract", { from: deployer, args: [], log: true });
        let deployedCrimeContract = await ethers.getContractAt("CrimeContract", crimecontract.address);

        cruisemissilecontract = await deploy("CruiseMissileContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
        let deployedCruiseMissileContract = await ethers.getContractAt("CruiseMissileContract", cruisemissilecontract.address);

        environmentcontract = await deploy("EnvironmentContract", { from: deployer, args: [], log: true });
        let deployedEnvironmentContract = await ethers.getContractAt("EnvironmentContract", environmentcontract.address);

        fighterscontract = await deploy("FightersContract", { from: deployer, args: [], log: true });
        let deployedFightersContract = await ethers.getContractAt("FightersContract", fighterscontract.address);

        fighterlosses = await deploy("FighterLosses", { from: deployer, args: [], log: true });
        let deployedFighterLosses = await ethers.getContractAt("FighterLosses", fighterlosses.address);

        fightersmarketplace1 = await deploy("FightersMarketplace1", { from: deployer, args: [], log: true });
        let deployedFightersMarketplace1 = await ethers.getContractAt("FightersMarketplace1", fightersmarketplace1.address);

        fightersmarketplace2 = await deploy("FightersMarketplace2", { from: deployer, args: [], log: true });
        let deployedFightersMarketplace2 = await ethers.getContractAt("FightersMarketplace2", fightersmarketplace2.address);

        forcescontract = await deploy("ForcesContract", { from: deployer, args: [], log: true });
        let deployedForcesContract = await ethers.getContractAt("ForcesContract", forcescontract.address);

        spycontract = await deploy("SpyContract", { from: deployer, args: [], log: true });
        let deployedSpyContract = await ethers.getContractAt("SpyContract", spycontract.address);

        missilescontract = await deploy("MissilesContract", { from: deployer, args: [], log: true });
        let deployedMissilesContract = await ethers.getContractAt("MissilesContract", missilescontract.address);

        groundbattlecontract = await deploy("GroundBattleContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
        let deployedGroundBattleContract = await ethers.getContractAt("GroundBattleContract", groundbattlecontract.address);

        improvementscontract1 = await deploy("ImprovementsContract1", { from: deployer, args: [], log: true });
        let deployedImprovementsContract1 = await ethers.getContractAt("ImprovementsContract1", improvementscontract1.address);

        improvementscontract2 = await deploy("ImprovementsContract2", { from: deployer, args: [], log: true });
        let deployedImprovementsContract2 = await ethers.getContractAt("ImprovementsContract2", improvementscontract2.address);

        improvementscontract3 = await deploy("ImprovementsContract3", { from: deployer, args: [], log: true });
        let deployedImprovementsContract3 = await ethers.getContractAt("ImprovementsContract3", improvementscontract3.address);

        improvementscontract4 = await deploy("ImprovementsContract4", { from: deployer, args: [], log: true });
        let deployedImprovementsContract4 = await ethers.getContractAt("ImprovementsContract4", improvementscontract4.address);

        infrastructurecontract = await deploy("InfrastructureContract", { from: deployer, args: [], log: true });
        let deployedInfrastructureContract = await ethers.getContractAt("InfrastructureContract", infrastructurecontract.address);

        infrastructuremarketplace = await deploy("InfrastructureMarketContract", { from: deployer, args: [], log: true });
        let deployedInfrastructureMarketContract = await ethers.getContractAt("InfrastructureMarketContract", infrastructuremarketplace.address);

        keepercontract = await deploy("KeeperContract", { from: deployer, args: [], log: true });
        let deployedKeeperContract = await ethers.getContractAt("KeeperContract", keepercontract.address);

        landmarketcontract = await deploy("LandMarketContract", { from: deployer, args: [], log: true });
        let deployedLandMarketContract = await ethers.getContractAt("LandMarketContract", landmarketcontract.address);

        militarycontract = await deploy("MilitaryContract", { from: deployer, args: [], log: true });
        let deployedMilitaryContract = await ethers.getContractAt("MilitaryContract", militarycontract.address);

        nationstrengthcontract = await deploy("NationStrengthContract", { from: deployer, args: [], log: true });
        let deployedNationStrengthContract = await ethers.getContractAt("NationStrengthContract", nationstrengthcontract.address);

        navycontract = await deploy("NavyContract", { from: deployer, args: [], log: true });
        let deployedNavyContract = await ethers.getContractAt("NavyContract", navycontract.address);

        navycontract2 = await deploy("NavyContract2", { from: deployer, args: [], log: true });
        let deployedNavyContract2 = await ethers.getContractAt("NavyContract2", navycontract2.address);

        additionalnavycontract = await deploy("AdditionalNavyContract", { from: deployer, args: [], log: true });
        let deployedAdditionalNavyContract = await ethers.getContractAt("AdditionalNavyContract", additionalnavycontract.address);

        navalactionscontract = await deploy("NavalActionsContract", { from: deployer, args: [], log: true });
        let deployedNavalActionsContract = await ethers.getContractAt("NavalActionsContract", navalactionscontract.address);

        navalblockadecontract = await deploy("NavalBlockadeContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
        let deployedNavalBlockadeContract = await ethers.getContractAt("NavalBlockadeContract", navalblockadecontract.address);

        breakblockadecontract = await deploy("BreakBlocadeContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
        let deployedBreakBlocadeContract = await ethers.getContractAt("BreakBlocadeContract", breakblockadecontract.address);

        navalattackcontract = await deploy("NavalAttackContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
        let deployedNavalAttackContract = await ethers.getContractAt("NavalAttackContract", navalattackcontract.address);

        nukecontract = await deploy("NukeContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
        let deployedNukeContract = await ethers.getContractAt("NukeContract", nukecontract.address);

        resourcescontract = await deploy("ResourcesContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
        let deployedResourcesContract = await ethers.getContractAt("ResourcesContract", resourcescontract.address);

        bonusresourcescontract = await deploy("BonusResourcesContract", { from: deployer, args: [], log: true });
        let deployedBonusResourcesContract = await ethers.getContractAt("BonusResourcesContract", bonusresourcescontract.address);

        senatecontract = await deploy("SenateContract", { from: deployer, args: [], log: true });
        let deployedSenateContract = await ethers.getContractAt("SenateContract", senatecontract.address);

        spyoperationscontract = await deploy("SpyOperationsContract", { from: deployer, args: [], log: true });
        let deployedSpyOperationsContract = await ethers.getContractAt("SpyOperationsContract", spyoperationscontract.address);

        taxescontract = await deploy("TaxesContract", { from: deployer, args: [], log: true });
        let deployedTaxesContract = await ethers.getContractAt("TaxesContract", taxescontract.address);

        additionaltaxescontract = await deploy("AdditionalTaxesContract", { from: deployer, args: [], log: true });
        let deployedAdditionalTaxesContract = await ethers.getContractAt("AdditionalTaxesContract", additionaltaxescontract.address);

        technologymarketcontrat = await deploy("TechnologyMarketContract", { from: deployer, args: [], log: true });
        let deployedTechnologyMarketContract = await ethers.getContractAt("TechnologyMarketContract", technologymarketcontrat.address);

        treasurycontract = await deploy("TreasuryContract", { from: deployer, args: [], log: true });
        let deployedTreasuryContract = await ethers.getContractAt("TreasuryContract", treasurycontract.address);

        warcontract = await deploy("WarContract", { from: deployer, args: [], log: true });
        let deployedWarContract = await ethers.getContractAt("WarContract", warcontract.address);

        wonderscontract1 = await deploy("WondersContract1", { from: deployer, args: [], log: true });
        let deployedWondersContract1 = await ethers.getContractAt("WondersContract1", wonderscontract1.address);
        
        wonderscontract2 = await deploy("WondersContract2", { from: deployer, args: [], log: true });
        let deployedWondersContract2 = await ethers.getContractAt("WondersContract2", wonderscontract2.address);

        wonderscontract3 = await deploy("WondersContract3", { from: deployer, args: [], log: true });
        let deployedWondersContract3 = await ethers.getContractAt("WondersContract3", wonderscontract3.address);

        wonderscontract4 = await deploy("WondersContract4", { from: deployer, args: [], log: true });
        let deployedWondersContract4 = await ethers.getContractAt("WondersContract4", wonderscontract4.address);

        messenger = await deploy("Messenger", { from: deployer, args: [], log: true });
        let deployedMessenger = await ethers.getContractAt("Messenger", messenger.address);

        console.log("All contracts deployed successfully!");

        await warbucksContract.settings(
            treasurycontract.address,
            countryminter.address
        )
    
        console.log("warbucks settings");
        
        await deployedAidContract.settings(
            countryminter.address, 
            treasurycontract.address, 
            forcescontract.address, 
            infrastructurecontract.address, 
            keepercontract.address, 
            wonderscontract1.address,
            senatecontract.address,
            countryparameterscontract.address)
        
        console.log("aid contract settings");
    
        await deployedAirBattleContract.settings(
            warcontract.address, 
            fighterscontract.address, 
            bomberscontract.address, 
            infrastructurecontract.address, 
            forcescontract.address, 
            fighterlosses.address,
            countryminter.address,
            additionalairbattle.address
        )
    
        console.log("air battle contract settings");
    
        await deployedAdditionalAirBattle.settings(
            warcontract.address, 
            fighterscontract.address, 
            bomberscontract.address, 
            infrastructurecontract.address, 
            forcescontract.address, 
            fighterlosses.address,
            countryminter.address,
            airbattlecontract.address
        )
    
        console.log("additional air battle contract settings");
    
        await deployedBillsContract.settings(
            countryminter.address,
            treasurycontract.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            forcescontract.address,
            fighterscontract.address,
            navycontract.address,
            resourcescontract.address)
        await deployedBillsContract.settings2(
            improvementscontract1.address,
            improvementscontract2.address,
            missilescontract.address,
            wonderscontract4.address,
            infrastructurecontract.address,
            bonusresourcescontract.address,
            navycontract2.address,
            countryparameterscontract.address,
            navalblockadecontract.address
        )
    
        console.log("bills contract settings");
        
        await deployedBombersContract.settings(
            countryminter.address, 
            bombersmarketplace1.address,
            bombersmarketplace2.address,
            airbattlecontract.address,
            treasurycontract.address,
            fighterscontract.address,
            infrastructurecontract.address,
            warcontract.address)
    
        console.log("bombers contract settings");
    
        await deployedBombersMarketplace1.settings(
            countryminter.address,
            bomberscontract.address,
            fighterscontract.address,
            fightersmarketplace1.address,
            infrastructurecontract.address,
            treasurycontract.address)
    
        console.log("bombers marketplace 1 settings");
    
        await deployedBombersMarketplace2.settings(
            countryminter.address,
            bomberscontract.address,
            fighterscontract.address,
            fightersmarketplace1.address,
            infrastructurecontract.address,
            treasurycontract.address)
        
        console.log("bombers marketplace 2 settings");
        
        await deployedCountryMinter.settings(
            countryparameterscontract.address,
            treasurycontract.address,
            infrastructurecontract.address,
            resourcescontract.address,
            missilescontract.address,
            senatecontract.address,
            warbucks.address,
            bonusresourcescontract.address)
        await deployedCountryMinter.settings2(
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address)
        await deployedCountryMinter.settings3(
            militarycontract.address,
            forcescontract.address,
            navycontract.address,
            navycontract2.address,
            navalactionscontract.address,
            fighterscontract.address,
            bomberscontract.address)
        
        console.log("country minter settings");
        
        await deployedCountryParametersContract.settings(
            spyoperationscontract.address,
            countryminter.address,
            senatecontract.address,
            keepercontract.address,
            nukecontract.address,
            groundbattlecontract.address,
            wonderscontract1.address,
            treasurycontract.address
        )
    
        console.log("country parameters contract settings");
    
        await deployedAllianceManager.settings(
            countryminter.address
        )
    
        console.log("alliance manager settings");
    
        await deployedCrimeContract.settings(
            infrastructurecontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            countryparameterscontract.address,
            wonderscontract2.address)
        
        console.log("crime contract settings");
        
        await deployedCruiseMissileContract.settings(
            forcescontract.address,
            countryminter.address,
            warcontract.address,
            infrastructurecontract.address,
            missilescontract.address)
        await deployedCruiseMissileContract.settings2(
            improvementscontract1.address,
            improvementscontract3.address,
            improvementscontract4.address,
            wonderscontract2.address)
        
        console.log("cruise missile contract settings");
    
        await deployedEnvironmentContract.settings(
            countryminter.address,
            resourcescontract.address,
            infrastructurecontract.address,
            wonderscontract3.address,
            wonderscontract4.address,
            forcescontract.address,
            countryparameterscontract.address,
            additionaltaxescontract.address,
            missilescontract.address,
            nukecontract.address)
        await deployedEnvironmentContract.settings2(
            improvementscontract1.address,
            improvementscontract3.address,
            improvementscontract4.address,
            bonusresourcescontract.address)
    
        console.log("environment contract settings");
        
        await deployedFightersContract.settings(
            countryminter.address,
            fightersmarketplace1.address,
            fightersmarketplace2.address,
            treasurycontract.address,
            warcontract.address,
            infrastructurecontract.address,
            resourcescontract.address,
            improvementscontract1.address,
            airbattlecontract.address,
            wonderscontract1.address,
            fighterlosses.address)
        await deployedFightersContract.settings2(
            navycontract.address,
            bomberscontract.address)
        
        console.log("fighters contract settings");
        
        await deployedFighterLosses.settings(
            fighterscontract.address,
            airbattlecontract.address)
    
        console.log("fighter losses settings");
    
        await deployedFightersMarketplace1.settings(
            countryminter.address,
            bomberscontract.address,
            fighterscontract.address,
            treasurycontract.address,
            infrastructurecontract.address,
            resourcescontract.address,
            improvementscontract1.address,
            wonderscontract1.address,
            wonderscontract4.address,
            navycontract.address)
        await deployedFightersMarketplace1.settings2(
            bonusresourcescontract.address,
            navycontract2.address
        )
    
        console.log("fighters marketplace 1 settings");
        
        await deployedFightersMarketplace2.settings(
            countryminter.address,
            bomberscontract.address,
            fighterscontract.address,
            fightersmarketplace1.address,
            treasurycontract.address,
            infrastructurecontract.address,
            resourcescontract.address,
            improvementscontract1.address)
        
        console.log("fighters marketplace 2 settings");
        
        await deployedForcesContract.settings(
            treasurycontract.address,
            aidcontract.address,
            spyoperationscontract.address,
            cruisemissilecontract.address,
            nukecontract.address,
            airbattlecontract.address,
            groundbattlecontract.address,
            warcontract.address)
        await deployedForcesContract.settings2(
            infrastructurecontract.address,
            resourcescontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            wonderscontract1.address,
            countryminter.address,
            keepercontract.address,
            countryparameterscontract.address)
        
        console.log("forces contract settings");
        
        await deployedMissilesContract.settings(
            treasurycontract.address,
            spyoperationscontract.address,
            nukecontract.address,
            airbattlecontract.address,
            wonderscontract2.address,
            nationstrengthcontract.address,
            infrastructurecontract.address)
        await deployedMissilesContract.settings2(
            resourcescontract.address,
            improvementscontract1.address,
            wonderscontract1.address,
            wonderscontract4.address,
            countryminter.address,
            keepercontract.address)
        
        console.log("missiles contract settings");
            
        await deployedGroundBattleContract.settings(
            warcontract.address,
            infrastructurecontract.address,
            forcescontract.address,
            treasurycontract.address,
            countryminter.address,
            militarycontract.address)
        await deployedGroundBattleContract.settings2(
            improvementscontract2.address,
            improvementscontract4.address,
            wonderscontract3.address,
            wonderscontract4.address,
            additionaltaxescontract.address,
            countryparameterscontract.address)
        
        console.log("ground battle contract settings");
        
        await deployedImprovementsContract1.settings(
            treasurycontract.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            navycontract.address,
            additionalnavycontract.address,
            countryminter.address,
            wonderscontract1.address,
            infrastructurecontract.address)
        
        console.log("improvements contract 1 settings");
    
        await deployedImprovementsContract2.settings(
            treasurycontract.address,
            forcescontract.address,
            wonderscontract1.address,
            countryminter.address,
            improvementscontract1.address,
            resourcescontract.address,
            spycontract.address
            )
        console.log("improvements contract 2 settings");
        
        await deployedImprovementsContract3.settings(
            treasurycontract.address,
            additionalnavycontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            countryminter.address,
            bonusresourcescontract.address,
            wonderscontract4.address
            )
        console.log("improvements contract 3 settings");
        
        await deployedImprovementsContract4.settings(
            treasurycontract.address,
            forcescontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            countryminter.address,
            wonderscontract4.address,
            resourcescontract.address
            )
        console.log("improvements contract 4 settings");
        
        await deployedInfrastructureContract.settings1(
            resourcescontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            infrastructuremarketplace.address,
            technologymarketcontrat.address,
            landmarketcontract.address,
            bonusresourcescontract.address
        )
        await deployedInfrastructureContract.settings2(
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            treasurycontract.address,
            countryparameterscontract.address,
            forcescontract.address,
            aidcontract.address
        )
        await deployedInfrastructureContract.settings3(
            spyoperationscontract.address,
            taxescontract.address,
            cruisemissilecontract.address,
            nukecontract.address,
            airbattlecontract.address,
            groundbattlecontract.address,
            countryminter.address,
            crimecontract.address,
            countryparameterscontract.address
        )
    
        console.log("infrastructure contract settings");
    
        await deployedInfrastructureMarketContract.settings(
            resourcescontract.address,
            countryparameterscontract.address,
            improvementscontract1.address,
            countryminter.address,
            wonderscontract2.address,
            wonderscontract3.address,
            treasurycontract.address,
            infrastructurecontract.address,
            bonusresourcescontract.address
        )
    
        console.log("infrastructure marketplace settings");
    
        await deployedLandMarketContract.settings(
            resourcescontract.address,
            countryminter.address,
            infrastructurecontract.address,
            treasurycontract.address
        )
    
        console.log("land market contract settings");
    
        await deployedMilitaryContract.settings(
            spyoperationscontract.address,
            countryminter.address,
            keepercontract.address
        )
    
        console.log("military contract settings");
    
        await deployedNationStrengthContract.settings(
            infrastructurecontract.address,
            forcescontract.address,
            fighterscontract.address,
            bomberscontract.address,
            navycontract.address,
            missilescontract.address,
            navycontract2.address
        )
    
        console.log("nation strength contract settings");
    
        await deployedNavyContract.settings(
            treasurycontract.address,
            improvementscontract1.address,
            improvementscontract3.address,
            improvementscontract4.address,
            resourcescontract.address,
            militarycontract.address,
            nukecontract.address,
            wonderscontract1.address,
            navalactionscontract.address,
            additionalnavycontract.address
        )
        await deployedNavyContract.settings2(
            countryminter.address,
            bonusresourcescontract.address,
            navycontract2.address,
            infrastructurecontract.address
        )
    
        console.log("navy contract settings");
    
        await deployedNavyContract2.settings(
            treasurycontract.address,
            improvementscontract1.address,
            improvementscontract3.address,
            improvementscontract4.address,
            resourcescontract.address,
            militarycontract.address,
            nukecontract.address,
            wonderscontract1.address,
            navalactionscontract.address,
            additionalnavycontract.address
        )
        await deployedNavyContract2.settings2(
            countryminter.address,
            bonusresourcescontract.address,
            navycontract.address,
            infrastructurecontract.address
        )
    
        console.log("navy contract 2 settings");
    
        await deployedNavalActionsContract.settings(
            navalblockadecontract.address,
            breakblockadecontract.address,
            navalattackcontract.address,
            keepercontract.address,
            navycontract.address,
            navycontract2.address,
            countryminter.address
        )
    
        console.log("naval actions contract settings");
    
        await deployedAdditionalNavyContract.settings(
            navycontract.address,
            navalactionscontract.address,
            militarycontract.address,
            wonderscontract1.address,
            improvementscontract4.address,
            navycontract2.address,
            navalblockadecontract.address,
            breakblockadecontract.address,
            navalattackcontract.address,
        )
    
        console.log("additional navy contract settings");
    
        await deployedNavalBlockadeContract.settings(
            navycontract.address,
            additionalnavycontract.address,
            navalactionscontract.address,
            warcontract.address,
            countryminter.address,
            keepercontract.address,
            breakblockadecontract.address,
            billscontract.address
        )
    
        console.log("naval blockade contract settings");
    
        await deployedBreakBlocadeContract.settings(
            countryminter.address,
            navalblockadecontract.address,
            navycontract.address,
            warcontract.address,
            improvementscontract4.address,
            navalactionscontract.address,
            navycontract2.address,
            additionalnavycontract.address,
        )
    
        console.log("break blockade contract settings");
    
        await deployedNavalAttackContract.settings(
            navycontract.address,
            warcontract.address,
            improvementscontract4.address,
            navalactionscontract.address,
            navycontract2.address,
            additionalnavycontract.address,
            countryminter.address,
        )
    
        console.log("naval attack contract settings");
    
        await deployedNukeContract.settings(
            countryminter.address,
            warcontract.address,
            wonderscontract1.address,
            wonderscontract4.address,
            improvementscontract3.address,
            improvementscontract4.address,
            infrastructurecontract.address,
            forcescontract.address,
            navycontract.address,
            missilescontract.address,
            keepercontract.address
        )
        await deployedNukeContract.settings2(
            countryparameterscontract.address
        )
    
        console.log("nuke contract settings");
    
        await deployedResourcesContract.settings(
            infrastructurecontract.address,
            improvementscontract2.address,
            countryminter.address,
            bonusresourcescontract.address,
            senatecontract.address,
            technologymarketcontrat.address,
            countryparameterscontract.address
        )
        await deployedBonusResourcesContract.settings(
            infrastructurecontract.address,
            countryminter.address,
            resourcescontract.address,
            crimecontract.address
        )
    
        console.log("resources contract settings");
    
        await deployedSenateContract.settings(
            countryminter.address,
            countryparameterscontract.address,
            wonderscontract3.address,
            keepercontract.address,
            resourcescontract.address
        )
    
        console.log("senate contract settings");
    
        await deployedSpyContract.settings(
            spyoperationscontract.address,
            treasurycontract.address,
            countryminter.address,
            improvementscontract2.address,
            wonderscontract1.address
            )
    
        console.log("spy contract settings");
    
        await deployedSpyOperationsContract.settings(
            infrastructurecontract.address,
            forcescontract.address,
            militarycontract.address,
            nationstrengthcontract.address,
            wonderscontract1.address,
            wonderscontract2.address,
            treasurycontract.address,
            countryparameterscontract.address,
            missilescontract.address,
            countryminter.address
        )
        await deployedSpyOperationsContract.settings2(
            keepercontract.address,
            spycontract.address
        )
    
        console.log("spy operations contract settings");
    
        await deployedTaxesContract.settings1(
            countryminter.address,
            infrastructurecontract.address,
            treasurycontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            additionaltaxescontract.address,
            bonusresourcescontract.address,
            keepercontract.address,
            environmentcontract.address
        )
        await deployedTaxesContract.settings2(
            countryparameterscontract.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            resourcescontract.address,
            forcescontract.address,
            militarycontract.address,
            crimecontract.address,
            navalblockadecontract.address
        )
    
        console.log("taxes contract settings");
    
        await deployedAdditionalTaxesContract.settings(
            countryparameterscontract.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            resourcescontract.address,
            militarycontract.address,
            infrastructurecontract.address,
            bonusresourcescontract.address
        )
        await deployedAdditionalTaxesContract.settings2(
            improvementscontract2.address,
            improvementscontract3.address,
            forcescontract.address,
        )
    
        console.log("additional taxes contract settings");
    
        await deployedTechnologyMarketContract.settings(
            resourcescontract.address,
            improvementscontract3.address,
            infrastructurecontract.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            treasurycontract.address,
            countryminter.address,
            bonusresourcescontract.address,
            crimecontract.address
        )
    
        console.log("technology market contract settings");
    
        await deployedTreasuryContract.settings1(
            warbucks.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            infrastructurecontract.address
        )
        await deployedTreasuryContract.settings2(
            groundbattlecontract.address,
            countryminter.address,
            keepercontract.address,
            forcescontract.address,
            navycontract.address,
            fighterscontract.address,
            bomberscontract.address,
            aidcontract.address,
            taxescontract.address,
            billscontract.address,
            spyoperationscontract.address
        )
        await deployedTreasuryContract.settings3(
            navycontract2.address,
            missilescontract.address,
            infrastructuremarketplace.address,
            landmarketcontract.address,
            technologymarketcontrat.address,
            fightersmarketplace1.address,
            fightersmarketplace2.address,
            bombersmarketplace1.address,
            bombersmarketplace2.address,
            countryparameterscontract.address,
            spycontract.address
        )
    
        console.log("treasury contract settings");
    
        await deployedWarContract.settings(
            countryminter.address,
            nationstrengthcontract.address,
            militarycontract.address,
            breakblockadecontract.address,
            navalattackcontract.address,
            airbattlecontract.address,
            groundbattlecontract.address,
            cruisemissilecontract.address,
            forcescontract.address,
            wonderscontract1.address,
            keepercontract.address
        )
        await deployedWarContract.settings2(
            treasurycontract.address,
            forcescontract.address,
            navalblockadecontract.address,
            nukecontract.address
        )
    
        console.log("war contract settings");
    
        await deployedWondersContract1.settings(
            treasurycontract.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            infrastructurecontract.address,
            countryminter.address
        )
    
        console.log("wonders contract 1 settings");
    
        await deployedWondersContract2.settings(
            treasurycontract.address,
            infrastructurecontract.address,
            wonderscontract1.address,
            wonderscontract3.address,
            wonderscontract4.address,
            countryminter.address,
            resourcescontract.address
        )
    
        console.log("wonders contract 2 settings");
    
        await deployedWondersContract3.settings(
            treasurycontract.address,
            infrastructurecontract.address,
            forcescontract.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract4.address,
            countryminter.address,
            resourcescontract.address
        )
    
        console.log("wonders contract 3 settings");
    
        await deployedWondersContract4.settings(
            treasurycontract.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            infrastructurecontract.address,
            wonderscontract1.address,
            wonderscontract3.address,
            countryminter.address
        )
    
        console.log("wonders contract 4 settings");
    
        await deployedMessenger.settings(
            countryminter.address,
        )
    
        console.log("messenger settings");
    
        console.log("settings initiated");
    
        if(chainId == 31337 || chainId == 1337) {
            if (!vrfCoordinatorV2Mock) {
                throw new Error("vrfCoordinatorV2Mock is undefined.");
            }
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, resourcescontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, countryparameterscontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, spyoperationscontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, cruisemissilecontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, nukecontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, airbattlecontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, groundbattlecontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, navalattackcontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, navalblockadecontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, breakblockadecontract.address);
    
        }
    
        const eaPath = "external_adapters/Contracts";
    
        if(chainId == 31337) {
            const contractMetadataLocation = `${eaPath}/contract-metadata.json`;
            let contractMetadata : any;
            
            let countryMinterArtifact = await artifacts.readArtifact("CountryMinter");
            let countryMinterAbi = countryMinterArtifact.abi;
    
            let warbucksArtifact = await artifacts.readArtifact("WarBucks");
            let warbucksAbi = warbucksArtifact.abi;
    
            let St8craftGovTokenArtifact = await artifacts.readArtifact("St8craftGovToken")
            let St8craftGovTokenAbi = St8craftGovTokenArtifact.abi
    
            let AidContractArtifact = await artifacts.readArtifact("AidContract")
            let AidContractAbi = AidContractArtifact.abi
    
            let AirBattleArtifact = await artifacts.readArtifact("AirBattleContract")
            let airbattleAbi = AirBattleArtifact.abi
    
            let AdditionalAirBattleArtifact = await artifacts.readArtifact("AdditionalAirBattle")
            let additionalairbattleAbi = AdditionalAirBattleArtifact.abi
    
            let BillsContractArtifact = await artifacts.readArtifact("BillsContract")
            let billsAbi = BillsContractArtifact.abi
    
            let BombersContractArtifact = await artifacts.readArtifact("BombersContract")
            let bombersAbi = BombersContractArtifact.abi
    
            let BombersMarketplace1Artifact = await artifacts.readArtifact("BombersMarketplace1")
            let bombersmarketplace1Abi = BombersMarketplace1Artifact.abi
    
            let BombersMarketplace2Artifact = await artifacts.readArtifact("BombersMarketplace2")
            let bombersmarketplace2Abi = BombersMarketplace2Artifact.abi
    
            let CountryParametersContractArtifact = await artifacts.readArtifact("CountryParametersContract")
            let countryParametersAbi = CountryParametersContractArtifact.abi
    
            let AllianceManagerArtifact = await artifacts.readArtifact("AllianceManager")
            let allianceManagerAbi = AllianceManagerArtifact.abi
    
            let CrimeContractArtifact = await artifacts.readArtifact("CrimeContract")
            let crimeAbi = CrimeContractArtifact.abi
    
            let CruiseMissileContractArtifact = await artifacts.readArtifact("CruiseMissileContract")
            let cruiseMissileAbi = CruiseMissileContractArtifact.abi
    
            let EnvironmentContractArtifact = await artifacts.readArtifact("EnvironmentContract")
            let environmentAbi = EnvironmentContractArtifact.abi
    
            let FightersContractArtifact = await artifacts.readArtifact("FightersContract")
            let fightersAbi = FightersContractArtifact.abi
    
            let FighterLossesArtifact = await artifacts.readArtifact("FighterLosses")
            let fighterLossesAbi = FighterLossesArtifact.abi
    
            let FightersMarketplace1Artifact = await artifacts.readArtifact("FightersMarketplace1")
            let fightersmarketplace1Abi = FightersMarketplace1Artifact.abi
    
            let FightersMarketplace2Artifact = await artifacts.readArtifact("FightersMarketplace2")
            let fightersmarketplace2Abi = FightersMarketplace2Artifact.abi
    
            let forcesArtifact = await artifacts.readArtifact("ForcesContract");
            let forcesAbi = forcesArtifact.abi;
    
            let MissilesContractArtifact = await artifacts.readArtifact("MissilesContract");
            let missilesAbi = MissilesContractArtifact.abi;
    
            let GroundBattleArtifact = await artifacts.readArtifact("GroundBattleContract");
            let groundBattleAbi = GroundBattleArtifact.abi;
    
            let ImprovementsContract1Artifact = await artifacts.readArtifact("ImprovementsContract1");
            let improvements1Abi = ImprovementsContract1Artifact.abi;
    
            let ImprovementsContract2Artifact = await artifacts.readArtifact("ImprovementsContract2");
            let improvements2Abi = ImprovementsContract2Artifact.abi;
    
            let ImprovementsContract3Artifact = await artifacts.readArtifact("ImprovementsContract3");
            let improvements3Abi = ImprovementsContract3Artifact.abi;
    
            let ImprovementsContract4Artifact = await artifacts.readArtifact("ImprovementsContract4");
            let improvements4Abi = ImprovementsContract4Artifact.abi;
    
            let InfrastructureContractArtifact = await artifacts.readArtifact("InfrastructureContract");
            let infrastructureAbi = InfrastructureContractArtifact.abi;
    
            let InfrastructureMarketplaceArtifact = await artifacts.readArtifact("InfrastructureMarketContract");
            let infrastructureMarketAbi = InfrastructureMarketplaceArtifact.abi;
    
            let KeeperContractArtifact = await artifacts.readArtifact("KeeperContract");
            let keeperAbi = KeeperContractArtifact.abi;
    
            let LandMarketContractArtifact = await artifacts.readArtifact("LandMarketContract");
            let landMarketAbi = LandMarketContractArtifact.abi;
    
            let MilitaryContractArtifact = await artifacts.readArtifact("MilitaryContract");
            let militaryAbi = MilitaryContractArtifact.abi;
    
            let NationStrengthContractArtifact = await artifacts.readArtifact("NationStrengthContract");
            let nationStrengthAbi = NationStrengthContractArtifact.abi;
    
            let NavyContractArtifact = await artifacts.readArtifact("NavyContract");
            let navyAbi = NavyContractArtifact.abi;
    
            let NavyContract2Artifact = await artifacts.readArtifact("NavyContract2");
            let navy2Abi = NavyContract2Artifact.abi;
    
            let NavalActionsContractArtifact = await artifacts.readArtifact("NavalActionsContract");
            let navalActionsAbi = NavalActionsContractArtifact.abi;
    
            let AdditionalNavyContractArtifact = await artifacts.readArtifact("AdditionalNavyContract");
            let additionalNavyAbi = AdditionalNavyContractArtifact.abi;
    
            let NavalBlockadeContractArtifact = await artifacts.readArtifact("NavalBlockadeContract");
            let navalBlockadeAbi = NavalBlockadeContractArtifact.abi;
    
            let BreakBlocadeContractArtifact = await artifacts.readArtifact("BreakBlocadeContract");
            let breakBlockadeAbi = BreakBlocadeContractArtifact.abi;
    
            let NavalAttackContractArtifact = await artifacts.readArtifact("NavalAttackContract");
            let navalAttackAbi = NavalAttackContractArtifact.abi;
    
            let NukeContractArtifact = await artifacts.readArtifact("NukeContract");
            let nukeAbi = NukeContractArtifact.abi;
    
            let ResourcesContractArtifact = await artifacts.readArtifact("ResourcesContract");
            let resourcesAbi = ResourcesContractArtifact.abi;
    
            let BonusResourcesContractArtifact = await artifacts.readArtifact("BonusResourcesContract");
            let bonusResourcesAbi = BonusResourcesContractArtifact.abi;
    
            let SenateContractArtifact = await artifacts.readArtifact("SenateContract");
            let senateAbi = SenateContractArtifact.abi;
    
            let SpyContractArtifact = await artifacts.readArtifact("SpyContract");
            let spycontractAbi = SpyContractArtifact.abi;
    
            let SpyOperationsContractArtifact = await artifacts.readArtifact("SpyOperationsContract");
            let spyOperationAbi = SpyOperationsContractArtifact.abi;
    
            let TaxesContractArtifact = await artifacts.readArtifact("TaxesContract");
            let taxesAbi = TaxesContractArtifact.abi;
    
            let AdditionalTaxesContractArtifact = await artifacts.readArtifact("AdditionalTaxesContract");
            let additionalTaxesAbi = AdditionalTaxesContractArtifact.abi;
    
            let TechnologyMarketContractArtifact = await artifacts.readArtifact("TechnologyMarketContract");
            let technologyAbi = TechnologyMarketContractArtifact.abi;
    
            let treasuryArtifact = await artifacts.readArtifact("TreasuryContract");
            let treasuryAbi = treasuryArtifact.abi;
    
            let warArtifact = await artifacts.readArtifact("WarContract");
            let warAbi = warArtifact.abi;
    
            let Wonders1Artifact = await artifacts.readArtifact("WondersContract1");
            let wonders1Abi = Wonders1Artifact.abi;
    
            let Wonders2Artifact = await artifacts.readArtifact("WondersContract2");
            let wonders2Abi = Wonders2Artifact.abi;
    
            let Wonders3Artifact = await artifacts.readArtifact("WondersContract3");
            let wonders3Abi = Wonders3Artifact.abi;
    
            let Wonders4Artifact = await artifacts.readArtifact("WondersContract4");
            let wonders4Abi = Wonders4Artifact.abi;
    
            let MessengerArtifact = await artifacts.readArtifact("Messenger");
            let messengerAbi = MessengerArtifact.abi;
    
            // Read Contract Metadata
            try {
              if (fs.existsSync(contractMetadataLocation)) {
                contractMetadata = fs.readFileSync(contractMetadataLocation).toString();
              } else {
                contractMetadata = "{}";
              }
            } catch (e) {
              console.log(e);
            }
            contractMetadata = JSON.parse(contractMetadata);
            
            if(chainId == 31337) {
                contractMetadata.HARDHAT = {
                    ...contractMetadata.HARDHAT,
                    countryminter: {
                        address: countryminter.address,
                        ABI: countryMinterAbi,
                    },
                    forcescontract: {
                        address: forcescontract.address,
                        ABI: forcesAbi,
                    },
                    nationstrengthcontract: {
                        address: nationstrengthcontract.address,
                        ABI: nationStrengthAbi,
                    },
                    treasurycontract: {
                        address: treasurycontract.address,
                        ABI: treasuryAbi,
                    },
                    spyoperationscontract: {
                        address: spyoperationscontract.address,
                        ABI: spyOperationAbi,
                    },
                    groundbattlecontract: {
                        address: groundbattlecontract.address,
                        ABI: groundBattleAbi,
                    }
                }
            } else if (chainId == 4002) {
                contractMetadata.TESTNET = {
                    ...contractMetadata.TESTNET,
                    countryminter: {
                        address: countryminter.address,
                        ABI: countryMinterAbi,
                    },
                    forcescontract: {
                        address: forcescontract.address,
                        ABI: forcesAbi,
                    },
                    nationstrengthcontract: {
                        address: nationstrengthcontract.address,
                        ABI: nationStrengthAbi,
                    },
                    treasurycontract: {
                        address: treasurycontract.address,
                        ABI: treasuryAbi,
                    },
                    spyoperationscontract: {
                        address: spyoperationscontract.address,
                        ABI: spyOperationAbi,
                    }
                };
            }
    
            fs.writeFileSync(
              contractMetadataLocation,
              JSON.stringify(contractMetadata, null, 2)
            );
    
            const scriptMetadataLocation = `script-metadata.json`;
            let scriptMetadata : any;
    
            try {
                if (fs.existsSync(scriptMetadataLocation)) {
                    scriptMetadata = fs.readFileSync(scriptMetadataLocation).toString();
                } else {
                    scriptMetadata = "{}";
                }
            } catch (e) {
                console.log(e);
            }
    
            scriptMetadata = JSON.parse(scriptMetadata);
        
            scriptMetadata.HARDHAT = {
                ...scriptMetadata.HARDHAT,
                countryminter: {
                    address: countryminter.address,
                    ABI: countryMinterAbi,
                },
                warbucks: {
                    address: warbucks.address,
                    ABI: warbucksAbi,
                },
                st8craftgovtoken: {
                    address: st8craftgovtoken.address,
                    ABI: St8craftGovTokenAbi
                },
                aidcontract: {
                    address: aidcontract.address,
                    ABI: AidContractAbi
                },
                airbattlecontract: {
                    address: airbattlecontract.address,
                    ABI: airbattleAbi
                },
                additionalairbattle: {
                    address: additionalairbattle.address,
                    ABI: additionalairbattleAbi
                },
                billscontract: {
                    address: billscontract.address,
                    ABI: billsAbi
                },
                bomberscontract: {
                    address: bomberscontract.address,
                    ABI: bombersAbi
                },
                bombersmarketplace1: {
                    address: bombersmarketplace1.address,
                    ABI: bombersmarketplace1Abi
                },
                bombersmarketplace2: {
                    address: bombersmarketplace2.address,
                    ABI: bombersmarketplace2Abi
                },
                countryparameterscontract: {
                    address: countryparameterscontract.address,
                    ABI: countryParametersAbi
                },
                alliancemanger: {
                    address: allianceManager.address,
                    ABI: allianceManagerAbi
                },
                crimecontract: {
                    address: crimecontract.address,
                    ABI: crimeAbi
                },
                cruisemissilecontract: {
                    address: cruisemissilecontract.address,
                    ABI: cruiseMissileAbi
                },
                environmentcontract: {
                    address: environmentcontract.address,
                    ABI: environmentAbi
                },
                fighterscontract: {
                    address: fighterscontract.address,
                    ABI: fightersAbi
                },
                fighterlosses: {
                    address: fighterlosses.address,
                    ABI: fighterLossesAbi
                },
                fightersmarketplace1: {
                    address: fightersmarketplace1.address,
                    ABI: fightersmarketplace1Abi
                },
                fightersmarketplace2: {
                    address: fightersmarketplace2.address,
                    ABI: fightersmarketplace2Abi
                },
                forcescontract: {
                    address: forcescontract.address,
                    ABI: forcesAbi,
                },
                missilescontract: {
                    address: missilescontract.address,
                    ABI: missilesAbi,
                },
                groundbattlecontract: {
                    address: groundbattlecontract.address,
                    ABI: groundBattleAbi,
                },
                improvementscontract1: {
                    address: improvementscontract1.address,
                    ABI: improvements1Abi,
                },
                improvementscontract2: {
                    address: improvementscontract2.address,
                    ABI: improvements2Abi,
                },
                improvementscontract3: {
                    address: improvementscontract3.address,
                    ABI: improvements3Abi,
                },
                improvementscontract4: {
                    address: improvementscontract4.address,
                    ABI: improvements4Abi,
                },
                infrastructurecontract: {
                    address: infrastructurecontract.address,
                    ABI: infrastructureAbi,
                },
                infrastructuremarketplace: {
                    address: infrastructuremarketplace.address,
                    ABI: infrastructureMarketAbi,
                },
                keepercontract: {
                    address: keepercontract.address,
                    ABI: keeperAbi,
                },
                landmarketcontract: {
                    address: landmarketcontract.address,
                    ABI: landMarketAbi,
                },
                militarycontract: {
                    address: militarycontract.address,
                    ABI: militaryAbi,
                },
                nationstrengthcontract: {
                    address: nationstrengthcontract.address,
                    ABI: nationStrengthAbi,
                },
                navycontract: {
                    address: navycontract.address,
                    ABI: navyAbi,
                },
                navycontract2: {
                    address: navycontract2.address,
                    ABI: navy2Abi,
                },
                navalactionscontract: {
                    address: navalactionscontract.address,
                    ABI: navalActionsAbi,
                },
                additionalnavycontract: {
                    address: additionalnavycontract.address,
                    ABI: additionalNavyAbi,
                },
                navalblockadecontract: {
                    address: navalblockadecontract.address,
                    ABI: navalBlockadeAbi,
                },
                breakblockadecontract: {
                    address: breakblockadecontract.address,
                    ABI: breakBlockadeAbi,
                },
                navalattackcontract: {
                    address: navalattackcontract.address,
                    ABI: navalAttackAbi,
                },
                nukecontract: {
                    address: nukecontract.address,
                    ABI: nukeAbi,
                },
                resourcescontract: {
                    address: resourcescontract.address,
                    ABI: resourcesAbi,
                },
                bonusresourcescontract: {
                    address: bonusresourcescontract.address,
                    ABI: bonusResourcesAbi,
                },
                senatecontract: {
                    address: senatecontract.address,
                    ABI: senateAbi,
                },
                spycontract: {
                    address: spycontract.address,
                    ABI: spycontractAbi,
                },
                spyoperationscontract: {
                    address: spyoperationscontract.address,
                    ABI: spyOperationAbi,
                },
                taxescontract: {
                    address: taxescontract.address,
                    ABI: taxesAbi,
                },
                additionaltaxescontract: {
                    address: additionaltaxescontract.address,
                    ABI: additionalTaxesAbi,
                },
                technologymarketcontract: {
                    address: technologymarketcontrat.address,
                    ABI: technologyAbi,
                },
                treasurycontract: {
                    address: treasurycontract.address,
                    ABI: treasuryAbi,
                },
                warcontract: {
                    address: warcontract.address,
                    ABI: warAbi,
                },
                wonderscontract1: {
                    address: wonderscontract1.address,
                    ABI: wonders1Abi,
                },
                wonderscontract2: {
                    address: wonderscontract2.address,
                    ABI: wonders2Abi,
                },
                wonderscontract3: {
                    address: wonderscontract3.address,
                    ABI: wonders3Abi,
                },
                wonderscontract4: {
                    address: wonderscontract4.address,
                    ABI: wonders4Abi,
                },
                messenger: {
                    address: messenger.address,
                    ABI: messengerAbi
                }
            };
            fs.writeFileSync(
                scriptMetadataLocation,
                JSON.stringify(scriptMetadata, null, 2)
            );
        }

    } else if (chainId === 84532) {
        const provider = new ethers.providers.JsonRpcProvider("https://sepolia.base.org");
        const ledgerSigner = new LedgerSigner(provider, "hid", "m/44'/60'/0'/0/0");
        deployer = await ledgerSigner.getAddress();
        console.log("Deploying with Ledger account:", deployer);
        const WarBucksFactory = await ethers.getContractFactory("WarBucks", ledgerSigner);
        const deployedWarBucks = await WarBucksFactory.deploy(INITIAL_SUPPLY_WARBUCKS);
        await deployedWarBucks.deployed();
        console.log("WarBucks deployed at:", deployedWarBucks.address);
    
        const St8craftGovTokenFactory = await ethers.getContractFactory("St8craftGovToken", ledgerSigner);
        const deployedSt8craftGovToken = await St8craftGovTokenFactory.deploy(INITIAL_SUPPLY_ST8CRAFT);
        await deployedSt8craftGovToken.deployed();
        console.log("St8craftGovToken deployed at:", deployedSt8craftGovToken.address);
    
        const AidContractFactory = await ethers.getContractFactory("AidContract", ledgerSigner);
        const deployedAidContract = await AidContractFactory.deploy();
        await deployedAidContract.deployed();
        console.log("AidContract deployed at:", deployedAidContract.address);
    
        const AirBattleContractFactory = await ethers.getContractFactory("AirBattleContract", ledgerSigner);
        const deployedAirBattleContract = await AirBattleContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await deployedAirBattleContract.deployed();
        console.log("AirBattleContract deployed at:", deployedAirBattleContract.address);
    
        const AdditionalAirBattleFactory = await ethers.getContractFactory("AdditionalAirBattle", ledgerSigner);
        const deployedAdditionalAirBattle = await AdditionalAirBattleFactory.deploy();
        await deployedAdditionalAirBattle.deployed();
        console.log("AdditionalAirBattle deployed at:", deployedAdditionalAirBattle.address);
    
        const BillsContractFactory = await ethers.getContractFactory("BillsContract", ledgerSigner);
        const deployedBillsContract = await BillsContractFactory.deploy();
        await deployedBillsContract.deployed();
        console.log("BillsContract deployed at:", deployedBillsContract.address);
    
        const BombersContractFactory = await ethers.getContractFactory("BombersContract", ledgerSigner);
        const deployedBombersContract = await BombersContractFactory.deploy();
        await deployedBombersContract.deployed();
        console.log("BombersContract deployed at:", deployedBombersContract.address);
    
        const BombersMarketplace1Factory = await ethers.getContractFactory("BombersMarketplace1", ledgerSigner);
        const deployedBombersMarketplace1 = await BombersMarketplace1Factory.deploy();
        await deployedBombersMarketplace1.deployed();
        console.log("BombersMarketplace1 deployed at:", deployedBombersMarketplace1.address);
    
        const BombersMarketplace2Factory = await ethers.getContractFactory("BombersMarketplace2", ledgerSigner);
        const deployedBombersMarketplace2 = await BombersMarketplace2Factory.deploy();
        await deployedBombersMarketplace2.deployed();
        console.log("BombersMarketplace2 deployed at:", deployedBombersMarketplace2.address);
    
        const CountryMinterFactory = await ethers.getContractFactory("CountryMinter", ledgerSigner);
        const deployedCountryMinter = await CountryMinterFactory.deploy();
        await deployedCountryMinter.deployed();
        console.log("CountryMinter deployed at:", deployedCountryMinter.address);
    
        const CountryParametersContractFactory = await ethers.getContractFactory("CountryParametersContract", ledgerSigner);
        const deployedCountryParametersContract = await CountryParametersContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await deployedCountryParametersContract.deployed();
        console.log("CountryParametersContract deployed at:", deployedCountryParametersContract.address);
    
        const AllianceManagerFactory = await ethers.getContractFactory("AllianceManager", ledgerSigner);
        const deployedAllianceManager = await AllianceManagerFactory.deploy();
        await deployedAllianceManager.deployed();
        console.log("AllianceManager deployed at:", deployedAllianceManager.address);
    
        const CrimeContractFactory = await ethers.getContractFactory("CrimeContract", ledgerSigner);
        const deployedCrimeContract = await CrimeContractFactory.deploy();
        await deployedCrimeContract.deployed();
        console.log("CrimeContract deployed at:", deployedCrimeContract.address);
    
        const CruiseMissileContractFactory = await ethers.getContractFactory("CruiseMissileContract", ledgerSigner);
        const deployedCruiseMissileContract = await CruiseMissileContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await deployedCruiseMissileContract.deployed();
        console.log("CruiseMissileContract deployed at:", deployedCruiseMissileContract.address);
    
        const EnvironmentContractFactory = await ethers.getContractFactory("EnvironmentContract", ledgerSigner);
        const deployedEnvironmentContract = await EnvironmentContractFactory.deploy();
        await deployedEnvironmentContract.deployed();
        console.log("EnvironmentContract deployed at:", deployedEnvironmentContract.address);
    
        const FightersContractFactory = await ethers.getContractFactory("FightersContract", ledgerSigner);
        const deployedFightersContract = await FightersContractFactory.deploy();
        await deployedFightersContract.deployed();
        console.log("FightersContract deployed at:", deployedFightersContract.address);
    
        const FighterLossesFactory = await ethers.getContractFactory("FighterLosses", ledgerSigner);
        const deployedFighterLosses = await FighterLossesFactory.deploy();
        await deployedFighterLosses.deployed();
        console.log("FighterLosses deployed at:", deployedFighterLosses.address);
    
        const FightersMarketplace1Factory = await ethers.getContractFactory("FightersMarketplace1", ledgerSigner);
        const deployedFightersMarketplace1 = await FightersMarketplace1Factory.deploy();
        await deployedFightersMarketplace1.deployed();
        console.log("FightersMarketplace1 deployed at:", deployedFightersMarketplace1.address);
    
        const FightersMarketplace2Factory = await ethers.getContractFactory("FightersMarketplace2", ledgerSigner);
        const deployedFightersMarketplace2 = await FightersMarketplace2Factory.deploy();
        await deployedFightersMarketplace2.deployed();
        console.log("FightersMarketplace2 deployed at:", deployedFightersMarketplace2.address);
    
        const ForcesContractFactory = await ethers.getContractFactory("ForcesContract", ledgerSigner);
        const deployedForcesContract = await ForcesContractFactory.deploy();
        await deployedForcesContract.deployed();
        console.log("ForcesContract deployed at:", deployedForcesContract.address);
    
        const SpyContractFactory = await ethers.getContractFactory("SpyContract", ledgerSigner);
        const deployedSpyContract = await SpyContractFactory.deploy();
        await deployedSpyContract.deployed();
        console.log("SpyContract deployed at:", deployedSpyContract.address);
    
        const MissilesContractFactory = await ethers.getContractFactory("MissilesContract", ledgerSigner);
        const deployedMissilesContract = await MissilesContractFactory.deploy();
        await deployedMissilesContract.deployed();
        console.log("MissilesContract deployed at:", deployedMissilesContract.address);
    
        const GroundBattleContractFactory = await ethers.getContractFactory("GroundBattleContract", ledgerSigner);
        const deployedGroundBattleContract = await GroundBattleContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await deployedGroundBattleContract.deployed();
        console.log("GroundBattleContract deployed at:", deployedGroundBattleContract.address);
    
        const ImprovementsContract1Factory = await ethers.getContractFactory("ImprovementsContract1", ledgerSigner);
        const deployedImprovementsContract1 = await ImprovementsContract1Factory.deploy();
        await deployedImprovementsContract1.deployed();
        console.log("ImprovementsContract1 deployed at:", deployedImprovementsContract1.address);
    
        const ImprovementsContract2Factory = await ethers.getContractFactory("ImprovementsContract2", ledgerSigner);
        const deployedImprovementsContract2 = await ImprovementsContract2Factory.deploy();
        await deployedImprovementsContract2.deployed();
        console.log("ImprovementsContract2 deployed at:", deployedImprovementsContract2.address);
    
        const ImprovementsContract3Factory = await ethers.getContractFactory("ImprovementsContract3", ledgerSigner);
        const deployedImprovementsContract3 = await ImprovementsContract3Factory.deploy();
        await deployedImprovementsContract3.deployed();
        console.log("ImprovementsContract3 deployed at:", deployedImprovementsContract3.address);
    
        const ImprovementsContract4Factory = await ethers.getContractFactory("ImprovementsContract4", ledgerSigner);
        const deployedImprovementsContract4 = await ImprovementsContract4Factory.deploy();
        await deployedImprovementsContract4.deployed();
        console.log("ImprovementsContract4 deployed at:", deployedImprovementsContract4.address);
    
        const InfrastructureContractFactory = await ethers.getContractFactory("InfrastructureContract", ledgerSigner);
        const deployedInfrastructureContract = await InfrastructureContractFactory.deploy();
        await deployedInfrastructureContract.deployed();
        console.log("InfrastructureContract deployed at:", deployedInfrastructureContract.address);
    
        const InfrastructureMarketContractFactory = await ethers.getContractFactory("InfrastructureMarketContract", ledgerSigner);
        const deployedInfrastructureMarketContract = await InfrastructureMarketContractFactory.deploy();
        await deployedInfrastructureMarketContract.deployed();
        console.log("InfrastructureMarketContract deployed at:", deployedInfrastructureMarketContract.address);
    
        const KeeperContractFactory = await ethers.getContractFactory("KeeperContract", ledgerSigner);
        const deployedKeeperContract = await KeeperContractFactory.deploy();
        await deployedKeeperContract.deployed();
        console.log("KeeperContract deployed at:", deployedKeeperContract.address);
    
        const LandMarketContractFactory = await ethers.getContractFactory("LandMarketContract", ledgerSigner);
        const deployedLandMarketContract = await LandMarketContractFactory.deploy();
        await deployedLandMarketContract.deployed();
        console.log("LandMarketContract deployed at:", deployedLandMarketContract.address);
    
        const MilitaryContractFactory = await ethers.getContractFactory("MilitaryContract", ledgerSigner);
        const deployedMilitaryContract = await MilitaryContractFactory.deploy();
        await deployedMilitaryContract.deployed();
        console.log("MilitaryContract deployed at:", deployedMilitaryContract.address);
    
        const NationStrengthContractFactory = await ethers.getContractFactory("NationStrengthContract", ledgerSigner);
        const deployedNationStrengthContract = await NationStrengthContractFactory.deploy();
        await deployedNationStrengthContract.deployed();
        console.log("NationStrengthContract deployed at:", deployedNationStrengthContract.address);
    
        const NavyContractFactory = await ethers.getContractFactory("NavyContract", ledgerSigner);
        const deployedNavyContract = await NavyContractFactory.deploy();
        await deployedNavyContract.deployed();
        console.log("NavyContract deployed at:", deployedNavyContract.address);
    
        const NavyContract2Factory = await ethers.getContractFactory("NavyContract2", ledgerSigner);
        const deployedNavyContract2 = await NavyContract2Factory.deploy();
        await deployedNavyContract2.deployed();
        console.log("NavyContract2 deployed at:", deployedNavyContract2.address);
    
        const AdditionalNavyContractFactory = await ethers.getContractFactory("AdditionalNavyContract", ledgerSigner);
        const deployedAdditionalNavyContract = await AdditionalNavyContractFactory.deploy();
        await deployedAdditionalNavyContract.deployed();
        console.log("AdditionalNavyContract deployed at:", deployedAdditionalNavyContract.address);
    
        const NavalActionsContractFactory = await ethers.getContractFactory("NavalActionsContract", ledgerSigner);
        const deployedNavalActionsContract = await NavalActionsContractFactory.deploy();
        await deployedNavalActionsContract.deployed();
        console.log("NavalActionsContract deployed at:", deployedNavalActionsContract.address);
    
        const NavalBlockadeContractFactory = await ethers.getContractFactory("NavalBlockadeContract", ledgerSigner);
        const deployedNavalBlockadeContract = await NavalBlockadeContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await deployedNavalBlockadeContract.deployed();
        console.log("NavalBlockadeContract deployed at:", deployedNavalBlockadeContract.address);
    
        const BreakBlocadeContractFactory = await ethers.getContractFactory("BreakBlocadeContract", ledgerSigner);
        const deployedBreakBlocadeContract = await BreakBlocadeContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await deployedBreakBlocadeContract.deployed();
        console.log("BreakBlocadeContract deployed at:", deployedBreakBlocadeContract.address);
    
        const NavalAttackContractFactory = await ethers.getContractFactory("NavalAttackContract", ledgerSigner);
        const deployedNavalAttackContract = await NavalAttackContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await deployedNavalAttackContract.deployed();
        console.log("NavalAttackContract deployed at:", deployedNavalAttackContract.address);
    
        const NukeContractFactory = await ethers.getContractFactory("NukeContract", ledgerSigner);
        const deployedNukeContract = await NukeContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await deployedNukeContract.deployed();
        console.log("NukeContract deployed at:", deployedNukeContract.address);
    
        const ResourcesContractFactory = await ethers.getContractFactory("ResourcesContract", ledgerSigner);
        const deployedResourcesContract = await ResourcesContractFactory.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await deployedResourcesContract.deployed();
        console.log("ResourcesContract deployed at:", deployedResourcesContract.address);
    
        const BonusResourcesContractFactory = await ethers.getContractFactory("BonusResourcesContract", ledgerSigner);
        const deployedBonusResourcesContract = await BonusResourcesContractFactory.deploy();
        await deployedBonusResourcesContract.deployed();
        console.log("BonusResourcesContract deployed at:", deployedBonusResourcesContract.address);
    
        const SenateContractFactory = await ethers.getContractFactory("SenateContract", ledgerSigner);
        const deployedSenateContract = await SenateContractFactory.deploy();
        await deployedSenateContract.deployed();
        console.log("SenateContract deployed at:", deployedSenateContract.address);
    
        const SpyOperationsContractFactory = await ethers.getContractFactory("SpyOperationsContract", ledgerSigner);
        const deployedSpyOperationsContract = await SpyOperationsContractFactory.deploy();
        await deployedSpyOperationsContract.deployed();
        console.log("SpyOperationsContract deployed at:", deployedSpyOperationsContract.address);
    
        const TaxesContractFactory = await ethers.getContractFactory("TaxesContract", ledgerSigner);
        const deployedTaxesContract = await TaxesContractFactory.deploy();
        await deployedTaxesContract.deployed();
        console.log("TaxesContract deployed at:", deployedTaxesContract.address);
    
        const AdditionalTaxesContractFactory = await ethers.getContractFactory("AdditionalTaxesContract", ledgerSigner);
        const deployedAdditionalTaxesContract = await AdditionalTaxesContractFactory.deploy();
        await deployedAdditionalTaxesContract.deployed();
        console.log("AdditionalTaxesContract deployed at:", deployedAdditionalTaxesContract.address);
    
        const TechnologyMarketContractFactory = await ethers.getContractFactory("TechnologyMarketContract", ledgerSigner);
        const deployedTechnologyMarketContract = await TechnologyMarketContractFactory.deploy();
        await deployedTechnologyMarketContract.deployed();
        console.log("TechnologyMarketContract deployed at:", deployedTechnologyMarketContract.address);
    
        const TreasuryContractFactory = await ethers.getContractFactory("TreasuryContract", ledgerSigner);
        const deployedTreasuryContract = await TreasuryContractFactory.deploy();
        await deployedTreasuryContract.deployed();
        console.log("TreasuryContract deployed at:", deployedTreasuryContract.address);
    
        const WarContractFactory = await ethers.getContractFactory("WarContract", ledgerSigner);
        const deployedWarContract = await WarContractFactory.deploy();
        await deployedWarContract.deployed();
        console.log("WarContract deployed at:", deployedWarContract.address);
    
        const WondersContract1Factory = await ethers.getContractFactory("WondersContract1", ledgerSigner);
        const deployedWondersContract1 = await WondersContract1Factory.deploy();
        await deployedWondersContract1.deployed();
        console.log("WondersContract1 deployed at:", deployedWondersContract1.address);
    
        const WondersContract2Factory = await ethers.getContractFactory("WondersContract2", ledgerSigner);
        const deployedWondersContract2 = await WondersContract2Factory.deploy();
        await deployedWondersContract2.deployed();
        console.log("WondersContract2 deployed at:", deployedWondersContract2.address);
    
        const WondersContract3Factory = await ethers.getContractFactory("WondersContract3", ledgerSigner);
        const deployedWondersContract3 = await WondersContract3Factory.deploy();
        await deployedWondersContract3.deployed();
        console.log("WondersContract3 deployed at:", deployedWondersContract3.address);
    
        const WondersContract4Factory = await ethers.getContractFactory("WondersContract4", ledgerSigner);
        const deployedWondersContract4 = await WondersContract4Factory.deploy();
        await deployedWondersContract4.deployed();
        console.log("WondersContract4 deployed at:", deployedWondersContract4.address);
    
        const MessengerFactory = await ethers.getContractFactory("Messenger", ledgerSigner);
        const deployedMessenger = await MessengerFactory.deploy();
        await deployedMessenger.deployed();
        console.log("Messenger deployed at:", deployedMessenger.address);


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

        await warbucksContract.settings(
            treasurycontract.address,
            countryminter.address
        )

        console.log("warbucks settings");
        
        await deployedAidContract.settings(
            countryminter.address, 
            treasurycontract.address, 
            forcescontract.address, 
            infrastructurecontract.address, 
            keepercontract.address, 
            wonderscontract1.address,
            senatecontract.address,
            countryparameterscontract.address)
        
        console.log("aid contract settings");

        await deployedAirBattleContract.settings(
            warcontract.address, 
            fighterscontract.address, 
            bomberscontract.address, 
            infrastructurecontract.address, 
            forcescontract.address, 
            fighterlosses.address,
            countryminter.address,
            additionalairbattle.address
        )

        console.log("air battle contract settings");

        await deployedAdditionalAirBattle.settings(
            warcontract.address, 
            fighterscontract.address, 
            bomberscontract.address, 
            infrastructurecontract.address, 
            forcescontract.address, 
            fighterlosses.address,
            countryminter.address,
            airbattlecontract.address
        )

        console.log("additional air battle contract settings");

        await deployedBillsContract.settings(
            countryminter.address,
            treasurycontract.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            forcescontract.address,
            fighterscontract.address,
            navycontract.address,
            resourcescontract.address)
        await deployedBillsContract.settings2(
            improvementscontract1.address,
            improvementscontract2.address,
            missilescontract.address,
            wonderscontract4.address,
            infrastructurecontract.address,
            bonusresourcescontract.address,
            navycontract2.address,
            countryparameterscontract.address,
            navalblockadecontract.address
        )

        console.log("bills contract settings");
        
        await deployedBombersContract.settings(
            countryminter.address, 
            bombersmarketplace1.address,
            bombersmarketplace2.address,
            airbattlecontract.address,
            treasurycontract.address,
            fighterscontract.address,
            infrastructurecontract.address,
            warcontract.address)

        console.log("bombers contract settings");

        await deployedBombersMarketplace1.settings(
            countryminter.address,
            bomberscontract.address,
            fighterscontract.address,
            fightersmarketplace1.address,
            infrastructurecontract.address,
            treasurycontract.address)

        console.log("bombers marketplace 1 settings");

        await deployedBombersMarketplace2.settings(
            countryminter.address,
            bomberscontract.address,
            fighterscontract.address,
            fightersmarketplace1.address,
            infrastructurecontract.address,
            treasurycontract.address)
        
        console.log("bombers marketplace 2 settings");
        
        await deployedCountryMinter.settings(
            countryparameterscontract.address,
            treasurycontract.address,
            infrastructurecontract.address,
            resourcescontract.address,
            missilescontract.address,
            senatecontract.address,
            warbucks.address,
            bonusresourcescontract.address)
        await deployedCountryMinter.settings2(
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address)
        await deployedCountryMinter.settings3(
            militarycontract.address,
            forcescontract.address,
            navycontract.address,
            navycontract2.address,
            navalactionscontract.address,
            fighterscontract.address,
            bomberscontract.address)
        
        console.log("country minter settings");
        
        await deployedCountryParametersContract.settings(
            spyoperationscontract.address,
            countryminter.address,
            senatecontract.address,
            keepercontract.address,
            nukecontract.address,
            groundbattlecontract.address,
            wonderscontract1.address,
            treasurycontract.address
        )

        console.log("country parameters contract settings");

        await deployedAllianceManager.settings(
            countryminter.address
        )

        console.log("alliance manager settings");

        await deployedCrimeContract.settings(
            infrastructurecontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            countryparameterscontract.address,
            wonderscontract2.address)
        
        console.log("crime contract settings");
        
        await deployedCruiseMissileContract.settings(
            forcescontract.address,
            countryminter.address,
            warcontract.address,
            infrastructurecontract.address,
            missilescontract.address)
        await deployedCruiseMissileContract.settings2(
            improvementscontract1.address,
            improvementscontract3.address,
            improvementscontract4.address,
            wonderscontract2.address)
        
        console.log("cruise missile contract settings");

        await deployedEnvironmentContract.settings(
            countryminter.address,
            resourcescontract.address,
            infrastructurecontract.address,
            wonderscontract3.address,
            wonderscontract4.address,
            forcescontract.address,
            countryparameterscontract.address,
            additionaltaxescontract.address,
            missilescontract.address,
            nukecontract.address)
        await deployedEnvironmentContract.settings2(
            improvementscontract1.address,
            improvementscontract3.address,
            improvementscontract4.address,
            bonusresourcescontract.address)

        console.log("environment contract settings");
        
        await deployedFightersContract.settings(
            countryminter.address,
            fightersmarketplace1.address,
            fightersmarketplace2.address,
            treasurycontract.address,
            warcontract.address,
            infrastructurecontract.address,
            resourcescontract.address,
            improvementscontract1.address,
            airbattlecontract.address,
            wonderscontract1.address,
            fighterlosses.address)
        await deployedFightersContract.settings2(
            navycontract.address,
            bomberscontract.address)
        
        console.log("fighters contract settings");
        
        await deployedFighterLosses.settings(
            fighterscontract.address,
            airbattlecontract.address)

        console.log("fighter losses settings");

        await deployedFightersMarketplace1.settings(
            countryminter.address,
            bomberscontract.address,
            fighterscontract.address,
            treasurycontract.address,
            infrastructurecontract.address,
            resourcescontract.address,
            improvementscontract1.address,
            wonderscontract1.address,
            wonderscontract4.address,
            navycontract.address)
        await deployedFightersMarketplace1.settings2(
            bonusresourcescontract.address,
            navycontract2.address
        )

        console.log("fighters marketplace 1 settings");
        
        await deployedFightersMarketplace2.settings(
            countryminter.address,
            bomberscontract.address,
            fighterscontract.address,
            fightersmarketplace1.address,
            treasurycontract.address,
            infrastructurecontract.address,
            resourcescontract.address,
            improvementscontract1.address)
        
        console.log("fighters marketplace 2 settings");
        
        await deployedForcesContract.settings(
            treasurycontract.address,
            aidcontract.address,
            spyoperationscontract.address,
            cruisemissilecontract.address,
            nukecontract.address,
            airbattlecontract.address,
            groundbattlecontract.address,
            warcontract.address)
        await deployedForcesContract.settings2(
            infrastructurecontract.address,
            resourcescontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            wonderscontract1.address,
            countryminter.address,
            keepercontract.address,
            countryparameterscontract.address)
        
        console.log("forces contract settings");
        
        await deployedMissilesContract.settings(
            treasurycontract.address,
            spyoperationscontract.address,
            nukecontract.address,
            airbattlecontract.address,
            wonderscontract2.address,
            nationstrengthcontract.address,
            infrastructurecontract.address)
        await deployedMissilesContract.settings2(
            resourcescontract.address,
            improvementscontract1.address,
            wonderscontract1.address,
            wonderscontract4.address,
            countryminter.address,
            keepercontract.address)
        
        console.log("missiles contract settings");
            
        await deployedGroundBattleContract.settings(
            warcontract.address,
            infrastructurecontract.address,
            forcescontract.address,
            treasurycontract.address,
            countryminter.address,
            militarycontract.address)
        await deployedGroundBattleContract.settings2(
            improvementscontract2.address,
            improvementscontract4.address,
            wonderscontract3.address,
            wonderscontract4.address,
            additionaltaxescontract.address,
            countryparameterscontract.address)
        
        console.log("ground battle contract settings");
        
        await deployedImprovementsContract1.settings(
            treasurycontract.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            navycontract.address,
            additionalnavycontract.address,
            countryminter.address,
            wonderscontract1.address,
            infrastructurecontract.address)
        
        console.log("improvements contract 1 settings");

        await deployedImprovementsContract2.settings(
            treasurycontract.address,
            forcescontract.address,
            wonderscontract1.address,
            countryminter.address,
            improvementscontract1.address,
            resourcescontract.address,
            spycontract.address
            )
        console.log("improvements contract 2 settings");
        
        await deployedImprovementsContract3.settings(
            treasurycontract.address,
            additionalnavycontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            countryminter.address,
            bonusresourcescontract.address,
            wonderscontract4.address
            )
        console.log("improvements contract 3 settings");
        
        await deployedImprovementsContract4.settings(
            treasurycontract.address,
            forcescontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            countryminter.address,
            wonderscontract4.address,
            resourcescontract.address
            )
        console.log("improvements contract 4 settings");
        
        await deployedInfrastructureContract.settings1(
            resourcescontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            infrastructuremarketplace.address,
            technologymarketcontrat.address,
            landmarketcontract.address,
            bonusresourcescontract.address
        )
        await deployedInfrastructureContract.settings2(
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            treasurycontract.address,
            countryparameterscontract.address,
            forcescontract.address,
            aidcontract.address
        )
        await deployedInfrastructureContract.settings3(
            spyoperationscontract.address,
            taxescontract.address,
            cruisemissilecontract.address,
            nukecontract.address,
            airbattlecontract.address,
            groundbattlecontract.address,
            countryminter.address,
            crimecontract.address,
            countryparameterscontract.address
        )

        console.log("infrastructure contract settings");

        await deployedInfrastructureMarketContract.settings(
            resourcescontract.address,
            countryparameterscontract.address,
            improvementscontract1.address,
            countryminter.address,
            wonderscontract2.address,
            wonderscontract3.address,
            treasurycontract.address,
            infrastructurecontract.address,
            bonusresourcescontract.address
        )

        console.log("infrastructure marketplace settings");

        await deployedLandMarketContract.settings(
            resourcescontract.address,
            countryminter.address,
            infrastructurecontract.address,
            treasurycontract.address
        )

        console.log("land market contract settings");

        await deployedMilitaryContract.settings(
            spyoperationscontract.address,
            countryminter.address,
            keepercontract.address
        )

        console.log("military contract settings");

        await deployedNationStrengthContract.settings(
            infrastructurecontract.address,
            forcescontract.address,
            fighterscontract.address,
            bomberscontract.address,
            navycontract.address,
            missilescontract.address,
            navycontract2.address
        )

        console.log("nation strength contract settings");

        await deployedNavyContract.settings(
            treasurycontract.address,
            improvementscontract1.address,
            improvementscontract3.address,
            improvementscontract4.address,
            resourcescontract.address,
            militarycontract.address,
            nukecontract.address,
            wonderscontract1.address,
            navalactionscontract.address,
            additionalnavycontract.address
        )
        await deployedNavyContract.settings2(
            countryminter.address,
            bonusresourcescontract.address,
            navycontract2.address,
            infrastructurecontract.address
        )

        console.log("navy contract settings");

        await deployedNavyContract2.settings(
            treasurycontract.address,
            improvementscontract1.address,
            improvementscontract3.address,
            improvementscontract4.address,
            resourcescontract.address,
            militarycontract.address,
            nukecontract.address,
            wonderscontract1.address,
            navalactionscontract.address,
            additionalnavycontract.address
        )
        await deployedNavyContract2.settings2(
            countryminter.address,
            bonusresourcescontract.address,
            navycontract.address,
            infrastructurecontract.address
        )

        console.log("navy contract 2 settings");

        await deployedNavalActionsContract.settings(
            navalblockadecontract.address,
            breakblockadecontract.address,
            navalattackcontract.address,
            keepercontract.address,
            navycontract.address,
            navycontract2.address,
            countryminter.address
        )

        console.log("naval actions contract settings");

        await deployedAdditionalNavyContract.settings(
            navycontract.address,
            navalactionscontract.address,
            militarycontract.address,
            wonderscontract1.address,
            improvementscontract4.address,
            navycontract2.address,
            navalblockadecontract.address,
            breakblockadecontract.address,
            navalattackcontract.address,
        )

        console.log("additional navy contract settings");

        await deployedNavalBlockadeContract.settings(
            navycontract.address,
            additionalnavycontract.address,
            navalactionscontract.address,
            warcontract.address,
            countryminter.address,
            keepercontract.address,
            breakblockadecontract.address,
            billscontract.address
        )

        console.log("naval blockade contract settings");

        await deployedBreakBlocadeContract.settings(
            countryminter.address,
            navalblockadecontract.address,
            navycontract.address,
            warcontract.address,
            improvementscontract4.address,
            navalactionscontract.address,
            navycontract2.address,
            additionalnavycontract.address,
        )

        console.log("break blockade contract settings");

        await deployedNavalAttackContract.settings(
            navycontract.address,
            warcontract.address,
            improvementscontract4.address,
            navalactionscontract.address,
            navycontract2.address,
            additionalnavycontract.address,
            countryminter.address,
        )

        console.log("naval attack contract settings");

        await deployedNukeContract.settings(
            countryminter.address,
            warcontract.address,
            wonderscontract1.address,
            wonderscontract4.address,
            improvementscontract3.address,
            improvementscontract4.address,
            infrastructurecontract.address,
            forcescontract.address,
            navycontract.address,
            missilescontract.address,
            keepercontract.address
        )
        await deployedNukeContract.settings2(
            countryparameterscontract.address
        )

        console.log("nuke contract settings");

        await deployedResourcesContract.settings(
            infrastructurecontract.address,
            improvementscontract2.address,
            countryminter.address,
            bonusresourcescontract.address,
            senatecontract.address,
            technologymarketcontrat.address,
            countryparameterscontract.address
        )
        await deployedBonusResourcesContract.settings(
            infrastructurecontract.address,
            countryminter.address,
            resourcescontract.address,
            crimecontract.address
        )

        console.log("resources contract settings");

        await deployedSenateContract.settings(
            countryminter.address,
            countryparameterscontract.address,
            wonderscontract3.address,
            keepercontract.address,
            resourcescontract.address
        )

        console.log("senate contract settings");

        await deployedSpyContract.settings(
            spyoperationscontract.address,
            treasurycontract.address,
            countryminter.address,
            improvementscontract2.address,
            wonderscontract1.address
            )

        console.log("spy contract settings");

        await deployedSpyOperationsContract.settings(
            infrastructurecontract.address,
            forcescontract.address,
            militarycontract.address,
            nationstrengthcontract.address,
            wonderscontract1.address,
            wonderscontract2.address,
            treasurycontract.address,
            countryparameterscontract.address,
            missilescontract.address,
            countryminter.address
        )
        await deployedSpyOperationsContract.settings2(
            keepercontract.address,
            spycontract.address
        )

        console.log("spy operations contract settings");

        await deployedTaxesContract.settings1(
            countryminter.address,
            infrastructurecontract.address,
            treasurycontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            additionaltaxescontract.address,
            bonusresourcescontract.address,
            keepercontract.address,
            environmentcontract.address
        )
        await deployedTaxesContract.settings2(
            countryparameterscontract.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            resourcescontract.address,
            forcescontract.address,
            militarycontract.address,
            crimecontract.address,
            navalblockadecontract.address
        )

        console.log("taxes contract settings");

        await deployedAdditionalTaxesContract.settings(
            countryparameterscontract.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            resourcescontract.address,
            militarycontract.address,
            infrastructurecontract.address,
            bonusresourcescontract.address
        )
        await deployedAdditionalTaxesContract.settings2(
            improvementscontract2.address,
            improvementscontract3.address,
            forcescontract.address,
        )

        console.log("additional taxes contract settings");

        await deployedTechnologyMarketContract.settings(
            resourcescontract.address,
            improvementscontract3.address,
            infrastructurecontract.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            treasurycontract.address,
            countryminter.address,
            bonusresourcescontract.address,
            crimecontract.address
        )

        console.log("technology market contract settings");

        await deployedTreasuryContract.settings1(
            warbucks.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            infrastructurecontract.address
        )
        await deployedTreasuryContract.settings2(
            groundbattlecontract.address,
            countryminter.address,
            keepercontract.address,
            forcescontract.address,
            navycontract.address,
            fighterscontract.address,
            bomberscontract.address,
            aidcontract.address,
            taxescontract.address,
            billscontract.address,
            spyoperationscontract.address
        )
        await deployedTreasuryContract.settings3(
            navycontract2.address,
            missilescontract.address,
            infrastructuremarketplace.address,
            landmarketcontract.address,
            technologymarketcontrat.address,
            fightersmarketplace1.address,
            fightersmarketplace2.address,
            bombersmarketplace1.address,
            bombersmarketplace2.address,
            countryparameterscontract.address,
            spycontract.address
        )

        console.log("treasury contract settings");

        await deployedWarContract.settings(
            countryminter.address,
            nationstrengthcontract.address,
            militarycontract.address,
            breakblockadecontract.address,
            navalattackcontract.address,
            airbattlecontract.address,
            groundbattlecontract.address,
            cruisemissilecontract.address,
            forcescontract.address,
            wonderscontract1.address,
            keepercontract.address
        )
        await deployedWarContract.settings2(
            treasurycontract.address,
            forcescontract.address,
            navalblockadecontract.address,
            nukecontract.address
        )

        console.log("war contract settings");

        await deployedWondersContract1.settings(
            treasurycontract.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            infrastructurecontract.address,
            countryminter.address
        )

        console.log("wonders contract 1 settings");

        await deployedWondersContract2.settings(
            treasurycontract.address,
            infrastructurecontract.address,
            wonderscontract1.address,
            wonderscontract3.address,
            wonderscontract4.address,
            countryminter.address,
            resourcescontract.address
        )

        console.log("wonders contract 2 settings");

        await deployedWondersContract3.settings(
            treasurycontract.address,
            infrastructurecontract.address,
            forcescontract.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract4.address,
            countryminter.address,
            resourcescontract.address
        )

        console.log("wonders contract 3 settings");

        await deployedWondersContract4.settings(
            treasurycontract.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            infrastructurecontract.address,
            wonderscontract1.address,
            wonderscontract3.address,
            countryminter.address
        )

        console.log("wonders contract 4 settings");

        await deployedMessenger.settings(
            countryminter.address,
        )

        console.log("messenger settings");

        console.log("settings initiated");
    
        console.log("✅ All contracts deployed successfully!");
    }

}

export default main