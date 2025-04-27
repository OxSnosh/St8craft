//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
import { network, ethers, artifacts } from "hardhat"
import { INITIAL_SUPPLY } from "../helper-hardhat-config"
import { 
    WarBucks, 
    MetaNationsGovToken,
    AidContract,
    AirBattleContract,
    AdditionalAirBattle,
    BillsContract,
    BombersContract,
    BombersMarketplace1,
    BombersMarketplace2,
    CountryMinter,
    CountryParametersContract,
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
    BonusResourcesContract
} from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { networkConfig } from "../helper-hardhat-config"
import fs from "fs"

async function main() {
    let chainId = network.config.chainId
    let subscriptionId    
    let vrfCoordinatorV2Mock
    let vrfCoordinatorV2Address    

    const FUND_AMOUNT = ethers.utils.parseEther("1")

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
        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        // vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        // subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    var gasLane = networkConfig[31337]["gasLane"]
    var callbackGasLimit =  networkConfig[31337]["callbackGasLimit"]

    let warbucks: WarBucks  
    let metanationsgovtoken: MetaNationsGovToken
    let aidcontract: AidContract
    let airbattlecontract: AirBattleContract
    let additionalairbattle: AdditionalAirBattle
    let billscontract: BillsContract
    let bombersmarketplace1: BombersMarketplace1
    let bombersmarketplace2: BombersMarketplace2
    let bomberscontract: BombersContract
    let countryminter: CountryMinter
    let countryparameterscontract: CountryParametersContract
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
    let signer0: SignerWithAddress
    let signer1: SignerWithAddress
    let signers: SignerWithAddress[]
    let addrs
    
    signers = await ethers.getSigners();
    signer0 = signers[0];
    signer1 = signers[1];

    const WarBucks = await ethers.getContractFactory("WarBucks")
    warbucks = await WarBucks.deploy(INITIAL_SUPPLY) as WarBucks
    await warbucks.deployed()
    console.log(`WarBuks token deployed to ${warbucks.address}`)

    const MetaNatonsGovToken = await ethers.getContractFactory(
        "MetaNationsGovToken"
    )
    metanationsgovtoken = await MetaNatonsGovToken.deploy(INITIAL_SUPPLY) as MetaNationsGovToken
    await metanationsgovtoken.deployed()
    console.log(`MetaNationsGovToken deployed to ${metanationsgovtoken.address}`)

    const AidContract = await ethers.getContractFactory("AidContract")
    aidcontract = await AidContract.deploy() as AidContract
    await aidcontract.deployed()
    console.log(`AidContract deployed tp ${aidcontract.address}`)
        //countryminter
        //treasury
        //forces
        //infrastructure
        //keeper
        //wonder1
    
    const AirBattleContract = await ethers.getContractFactory("AirBattleContract")
    airbattlecontract = await AirBattleContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as AirBattleContract
    await airbattlecontract.deployed()
    console.log(`AirBattleContract deployed tp ${airbattlecontract.address}`)
        //war
        //fighter
        //bomber
        //infrastructure
        //forces
        //fighterlosses
        //missiles
        //wonders1
        //vrfCoordinatorV2
        //subscriptionId
        //gasLAne
        //callbackGasLimit


    const AdditionalAirBattleContract = await ethers.getContractFactory("AdditionalAirBattle")
    additionalairbattle = await AdditionalAirBattleContract.deploy() as AdditionalAirBattle
    await additionalairbattle.deployed()
    // console.log(`AirBattleContract deployed tp ${airbattlecontract.address}`)

    const BillsContract = await ethers.getContractFactory("BillsContract")
    billscontract = await BillsContract.deploy() as BillsContract
    await billscontract.deployed()
    console.log(`BillsContract deployed tp ${billscontract.address}`)
        //countryminter
        //treasury
        //infrastructure
        //forces
        //fighters
        //navy
        //improvements1
        //improvements2
        //missiles
        //resources
        //wonders1
        //wonders2
        //wonders3
        //wonders4
        
    const BombersContract = await ethers.getContractFactory("BombersContract")
    bomberscontract = await BombersContract.deploy() as BombersContract
    await bomberscontract.deployed()
    console.log(`BomberContract deployed tp ${bomberscontract.address}`)
        //address _countryMinter,
        //address _bombersMarket,
        //address _airBattle,
        //address _treasuryAddress,
        //address _fightersAddress,
        //address _infrastructure,
        //address _war
        
    const BombersMarketplace1 = await ethers.getContractFactory("BombersMarketplace1")
    bombersmarketplace1 = await BombersMarketplace1.deploy() as BombersMarketplace1
    await bombersmarketplace1.deployed()
    console.log(`BomberMarketplace1 deployed tp ${bombersmarketplace1.address}`)
        //address _countryMinter,
        //address _bombers1,
        //address _fighters,
        //address _infrastructure,
        //address _treasury
        
        
    const BombersMarketplace2 = await ethers.getContractFactory("BombersMarketplace2")
    bombersmarketplace2 = await BombersMarketplace2.deploy() as BombersMarketplace2
    await bombersmarketplace2.deployed()
    console.log(`BomberMarketplace2 deployed tp ${bombersmarketplace2.address}`)
        //address _countryMinter,
        //address _bombers1,
        //address _fighters,
        //address _infrastructure,
        //address _treasury

    const CountryMinter = await ethers.getContractFactory("CountryMinter")
    countryminter = await CountryMinter.deploy()  as CountryMinter
    await countryminter.deployed()
    console.log(`CountryMinter deployed tp ${countryminter.address}`)

    const CountryParameters = await ethers.getContractFactory("CountryParametersContract")
    countryparameterscontract = await CountryParameters.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as CountryParametersContract
    await countryparameterscontract.deployed()
    console.log(`CountryParameters deployed to ${countryparameterscontract.address}`)
        // spyAddress  

    const CrimeContract = await ethers.getContractFactory("CrimeContract")
    crimecontract = await CrimeContract.deploy() as CrimeContract
    await crimecontract.deployed()
    console.log(`CrimeContract deployed tp ${crimecontract.address}`)
        // address _infrastructure,
        // address _improvements1,
        // address _improvements2,
        // address _improvements3,
        // address _parameters  

    const CruiseMissileContract = await ethers.getContractFactory("CruiseMissileContract")
    cruisemissilecontract = await CruiseMissileContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as CruiseMissileContract
    await cruisemissilecontract.deployed()
    console.log(`CruiseMissile deployed to ${cruisemissilecontract.address}`)
        // address _forces,
        // address _countryMinter,
        // address _war,
        // address _infrastructure,
        // address _missiles,
        // address _improvements1,
        // address _improvements3,
        // address _improvements4,
        // address _wonders2
        // address vrfCoordinatorV2,
        // uint64 subscriptionId,
        // bytes32 gasLane, // keyHash
        // uint32 callbackGasLimit 

    const EnvironmentContract = await ethers.getContractFactory("EnvironmentContract")
    environmentcontract = await EnvironmentContract.deploy() as EnvironmentContract
    await environmentcontract.deployed()
    console.log(`EnvironmentContract deployed to ${environmentcontract.address}`)
        // address _countryMinter,
        // address _resources,
        // address _infrastructure,
        // address _wonders3,
        // address _wonders4,
        // address _forces,
        // address _parameters,
        // address _taxes,
        // address _missiles,
        // address _nukes
        // address _improvements1,
        // address _improvements3,
        // address _improvements4

    const FightersContract = await ethers.getContractFactory("FightersContract")
    fighterscontract = await FightersContract.deploy() as FightersContract
    await fighterscontract.deployed()
    console.log(`FightersContract deployed to ${fighterscontract.address}`)
        // address _countryMinter,
        // address _fightersMarket,
        // address _treasuryAddress,
        // address _war,
        // address _infrastructure,
        // address _resources,
        // address _improvements1,
        // address _airBattle,
        // address _wonders1,
        // address _losses
        // address _navy, 
        // address _bombers

    const FighterLosses = await ethers.getContractFactory("FighterLosses")
    fighterlosses = await FighterLosses.deploy() as FighterLosses
    await fighterlosses.deployed()
    console.log(`FighterLosses deployed to ${fighterlosses.address}`)
        // fighters
        // air batle

    const FightersMarketplace1 = await ethers.getContractFactory("FightersMarketplace1")
    fightersmarketplace1 = await FightersMarketplace1.deploy() as FightersMarketplace1
    await fightersmarketplace1.deployed()
    console.log(`FightersMarket1 deployed to ${fightersmarketplace1.address}`)
        // address _countryMinter,
        // address _bombers,
        // address _fighters,
        // address _treasury,
        // address _infrastructure,
        // address _resources,
        // address _improvements1,
        // address _wonders4

    const FightersMarketplace2 = await ethers.getContractFactory("FightersMarketplace2")
    fightersmarketplace2 = await FightersMarketplace2.deploy() as FightersMarketplace2
    await fightersmarketplace2.deployed()
    console.log(`FightersMarket2 deployed to ${fightersmarketplace2.address}`)
        // address _countryMinter,
        // address _bombers,
        // address _fighters,
        // address _treasury,
        // address _infrastructure,
        // address _resources,
        // address _improvements1
        
    const ForcesContract = await ethers.getContractFactory("ForcesContract")
    forcescontract = await ForcesContract.deploy() as ForcesContract
    await forcescontract.deployed()
    console.log(`ForcesContract deployed to ${forcescontract.address}`)
        // address _treasuryAddress,
        // address _aid,
        // address _spyAddress,
        // address _cruiseMissile,
        // address _nukeAddress,
        // address _airBattle,
        // address _groundBattle,
        // address _warAddress
        // address _infrastructure,
        // address _resources,
        // address _improvements1,
        // address _improvements2,
        // address _wonders1,
        // address _countryMinter

    const SpyContract = await ethers.getContractFactory("SpyContract")
    spycontract = await SpyContract.deploy() as SpyContract
    await spycontract.deployed()
    console.log(`SpyContract deployed to ${spycontract.address}`)

    const MissilesContract = await ethers.getContractFactory("MissilesContract")
    missilescontract = await MissilesContract.deploy() as MissilesContract
    await missilescontract.deployed()
    console.log(`MissilesContract deployed to ${missilescontract.address}`)
        // address _treasury,
        // address _spyAddress,
        // address _nukeAddress,
        // address _airBattle,
        // address _strength
        // address _resources,
        // address _improvements1,
        // address _wonders1,
        // address _wonders2,
        // address _wonders4,
        // address _countryMinter

    const GroundBattleContract = await ethers.getContractFactory("GroundBattleContract")
    groundbattlecontract = await GroundBattleContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as GroundBattleContract
    await groundbattlecontract.deployed()
    console.log(`GroundBattleContract deployed to ${groundbattlecontract.address}`)
        // address _warAddress,
        // address _infrastructure,
        // address _forces,
        // address _treasury,
        // address _improvements2,
        // address _improvements3,
        // address _wonders3,
        // address _wonders4
        // address vrfCoordinatorV2,
        // uint64 subscriptionId,
        // bytes32 gasLane, // keyHash
        // uint32 callbackGasLimit
    
    const ImprovementsContract1 = await ethers.getContractFactory("ImprovementsContract1")
    improvementscontract1 = await ImprovementsContract1.deploy() as ImprovementsContract1
    await improvementscontract1.deployed()
    console.log(`ImprovementsContract1 deployed to ${improvementscontract1.address}`)
        // address _treasury,
        // address _improvements2,
        // address _improvements3,
        // address _improvements4,
        // address _navy

    const ImprovementsContract2 = await ethers.getContractFactory("ImprovementsContract2")
    improvementscontract2 = await ImprovementsContract2.deploy() as ImprovementsContract2
    await improvementscontract2.deployed()
    console.log(`ImprovementsContract2 deployed to ${improvementscontract2.address}`)
        // address _treasury,
        // address _forces,
        // address _improvements1

    const ImprovementsContract3 = await ethers.getContractFactory("ImprovementsContract3")
    improvementscontract3 = await ImprovementsContract3.deploy() as ImprovementsContract3
    await improvementscontract3.deployed()
    console.log(`ImprovementsContract3 deployed to ${improvementscontract3.address}`)
        // treasury
        // improvements 1
        // improvements 2
        // navy

    const ImprovementsContract4 = await ethers.getContractFactory("ImprovementsContract4")
    improvementscontract4 = await ImprovementsContract4.deploy() as ImprovementsContract4
    await improvementscontract4.deployed()
    console.log(`ImprovementsContract4 deployed to ${improvementscontract4.address}`)
        // treasury
        // improvements 1
        // improvements 2
        // forces
    
    const InfrastructureContract = await ethers.getContractFactory("InfrastructureContract")
    infrastructurecontract = await InfrastructureContract.deploy() as InfrastructureContract
    await infrastructurecontract.deployed()
    console.log(`InfrastructureContract deployed to ${infrastructurecontract.address}`)
        // address _resources,
        // address _improvements1,
        // address _improvements2,
        // address _improvements3,
        // address _improvements4,
        // address _infrastructureMarket,
        // address _techMarket,
        // address _landMarket
        // address _wonders1,
        // address _wonders2,
        // address _wonders3,
        // address _wonders4,
        // address _treasury,
        // address _parameters,
        // address _forces,
        // address _aid
        // address _spyAddress,
        // address _tax,
        // address _cruiseMissile,
        // address _nukeAddress,
        // address _airBattle,
        // address _groundBattle,
        // address _countryMinter

    const InfrastructureMarketContract = await ethers.getContractFactory("InfrastructureMarketContract")
    infrastructuremarketplace = await InfrastructureMarketContract.deploy() as InfrastructureMarketContract
    await infrastructuremarketplace.deployed()
    console.log(`InfrastructureMarketplace deployed to ${infrastructuremarketplace.address}`)
        // address _resources,
        // address _parameters,
        // address _improvements1,
        // address _countryMinter,
        // address _wonders2,
        // address _wonders3,
        // address _treasury,
        // address _infrastructure

    const KeeperContract = await ethers.getContractFactory("KeeperContract")
    keepercontract = await KeeperContract.deploy(86400) as KeeperContract
    await keepercontract.deployed()
    console.log(`KeeperContract deployed to ${keepercontract.address}`)
        // address _nukes,
        // address _aid,
        // address _war 
    
    const LandMarketContract = await ethers.getContractFactory("LandMarketContract")
    landmarketcontract = await LandMarketContract.deploy() as LandMarketContract
    await landmarketcontract.deployed()
    console.log(`LandMarketContract deployed to ${landmarketcontract.address}`)
        // address _resources,
        // address _countryMinter,
        // address _infrastructure,
        // address _treasury

    const MilitaryContract = await ethers.getContractFactory("MilitaryContract")
    militarycontract = await MilitaryContract.deploy() as MilitaryContract
    await militarycontract.deployed()
    console.log(`MilitaryContract deployed to ${militarycontract.address}`)
        // spy

    const NationStrengthContract = await ethers.getContractFactory("NationStrengthContract")
    nationstrengthcontract = await NationStrengthContract.deploy() as NationStrengthContract
    await nationstrengthcontract.deployed()
    console.log(`NationStrengthContract deployed to ${nationstrengthcontract.address}`)
        // address _infrastructure,
        // address _forces,
        // address _fighters,
        // address _bombers,
        // address _navy,
        // address _missiles

    const NavyContract = await ethers.getContractFactory("NavyContract")
    navycontract = await NavyContract.deploy() as NavyContract
    await navycontract.deployed()
    console.log(`NavyContract deployed to ${navycontract.address}`)

    const NavyContract2 = await ethers.getContractFactory("NavyContract2")
    navycontract2 = await NavyContract2.deploy() as NavyContract2
    await navycontract2.deployed()
    console.log(`NavyContract2 deployed to ${navycontract2.address}`)

    const AdditionalNavyContract = await ethers.getContractFactory("AdditionalNavyContract")
    additionalnavycontract = await AdditionalNavyContract.deploy() as AdditionalNavyContract
    await additionalnavycontract.deployed()
    console.log(`NavyContract deployed to ${additionalnavycontract.address}`)

        // address _treasuryAddress,
        // address _improvementsContract1Address,
        // address _improvementsContract3Address,
        // address _improvements4,
        // address _warAddress,
        // address _resources,
        // address _military,
        // address _nukes,
        // address _wonders1,
        // address _navalActions
    
    const NavalActionsContract = await ethers.getContractFactory("NavalActionsContract")
    navalactionscontract = await NavalActionsContract.deploy() as NavalActionsContract
    await navalactionscontract.deployed()
    console.log(`NavalActionsContract deployed to ${navalactionscontract.address}`)
        // address _navalBlockade,
        // address _breakBlockade,
        // address _navalAttack,
        // address _keeper,
        // address _navy,
        // address _countryMinter
    
    const NavalBlockadeContract = await ethers.getContractFactory("NavalBlockadeContract")
    navalblockadecontract = await NavalBlockadeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as NavalBlockadeContract
    await navalblockadecontract.deployed()
    console.log(`NavalBlockadeContract deployed to ${navalblockadecontract.address}`)
        // need randomness
        
        // address _navy,
        // address _navalAction,
        // address _war
    
    const BreakBlocadeContract = await ethers.getContractFactory("BreakBlocadeContract")
    breakblockadecontract = await BreakBlocadeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as BreakBlocadeContract
    await breakblockadecontract.deployed()
    console.log(`BreakBlocadeContract deployed to ${breakblockadecontract.address}`)

        //randomness

        // address _countryMinter,
        // address _navalBlockade,
        // address _navy,
        // address _warAddress,
        // address _improvements4,
        // address _navalActions
        
    const NavalAttackContract = await ethers.getContractFactory("NavalAttackContract")
    navalattackcontract = await NavalAttackContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as NavalAttackContract
    await navalattackcontract.deployed()
    console.log(`NavalAttackContract deployed to ${navalattackcontract.address}`)
        //randomness
        
        // address _navy,
        // address _war,
        // address _improvements4,
        // address _navalActions
    
    const NukeContract = await ethers.getContractFactory("NukeContract")
    nukecontract = await NukeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as NukeContract
    await nukecontract.deployed()
    console.log(`NukeContract deployed to ${nukecontract.address}`)

        // randomness
        
        // address _countryMinter,
        // address _warAddress,
        // address _wonders1,
        // address _wonders4,
        // address _improvements3,
        // address _improvements4,
        // address _infrastructure,
        // address _forces,
        // address _navy,
        // address _missiles,
        // address _keeper 
    
    const ResourcesContract = await ethers.getContractFactory("ResourcesContract")
    resourcescontract = await ResourcesContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as ResourcesContract
    await resourcescontract.deployed()
    console.log(`ResourcesContract deployed to ${resourcescontract.address}`)

        // randomness 
        // address _infrastructure,
        // address _improvements

    const BonusResourcesContract = await ethers.getContractFactory("BonusResourcesContract")
    bonusresourcescontract = await BonusResourcesContract.deploy() as BonusResourcesContract
    await bonusresourcescontract.deployed()
    console.log(`BonusResourcesContract deployed to ${bonusresourcescontract.address}`)

    const SenateContract = await ethers.getContractFactory("SenateContract")
    senatecontract = await SenateContract.deploy(20) as SenateContract
    await senatecontract.deployed()
    console.log(`SenateContract deployed to ${senatecontract.address}`)

        // address _countryMinter,
        // address _parameters,
        // address _wonders3
    
    const SpyOperationsContract = await ethers.getContractFactory("SpyOperationsContract")
    spyoperationscontract = await SpyOperationsContract.deploy() as SpyOperationsContract
    await spyoperationscontract.deployed()
    console.log(`SpyOperationsContract deployed to ${spyoperationscontract.address}`)

        //randomness

        // address _infrastructure,
        // address _forces,
        // address _military,
        // address _nationStrength,
        // address _wonders1,
        // address _treasury,
        // address _parameters,
        // address _missiles

    const TaxesContract = await ethers.getContractFactory("TaxesContract")
    taxescontract = await TaxesContract.deploy() as TaxesContract
    await taxescontract.deployed()
    console.log(`TaxesContract deployed to ${taxescontract.address}`)

        // address _countryMinter,
        // address _infrastructure,
        // address _treasury,
        // address _improvements1,
        // address _improvements2,
        // address _improvements3,
        // address _additionalTaxes
        // address _parameters,
        // address _wonders1,
        // address _wonders2,
        // address _wonders3,
        // address _wonders4,
        // address _resources,
        // address _forces,
        // address _military,
        // address _crime

    const AdditionalTaxesContract = await ethers.getContractFactory("AdditionalTaxesContract")
    additionaltaxescontract = await AdditionalTaxesContract.deploy() as AdditionalTaxesContract
    await additionaltaxescontract.deployed()
    console.log(`AdditionalTaxesContract deployed to ${additionaltaxescontract.address}`)

        // countryparameterscontract.address,
        // wonderscontract1.address,
        // wonderscontract2.address,
        // wonderscontract3.address,
        // wonderscontract4.address,
        // resourcescontract.address,
        // militarycontract.address,
        // infrastructurecontract.address

    const TechnologyMarketContract = await ethers.getContractFactory("TechnologyMarketContract")
    technologymarketcontrat = await TechnologyMarketContract.deploy() as TechnologyMarketContract
    await technologymarketcontrat.deployed()
    console.log(`TechnologyMarketContract deployed to ${technologymarketcontrat.address}`)

        // address _resources,
        // address _improvements3,
        // address _infrastructure,
        // address _wonders2,
        // address _wonders3,
        // address _wonders4,
        // address _treasury,
        // address _countryMinter

    const TreasuryContract = await ethers.getContractFactory("TreasuryContract")
    treasurycontract = await TreasuryContract.deploy() as TreasuryContract
    await treasurycontract.deployed()
    console.log(`TreasuryContract deployed to ${treasurycontract.address}`)

        // address _warBucksAddress,
        // address _wonders1,
        // address _improvements1,
        // address _infrastructure,
        // address _forces,
        // address _navy,
        // address _fighters,
        // address _aid,
        // address _taxes,
        // address _bills,
        // address _spyAddress
        // groundbattle
    
    const WarContract = await ethers.getContractFactory("WarContract")
    warcontract = await WarContract.deploy() as WarContract
    await warcontract.deployed()
    console.log(`WarContract deployed to ${warcontract.address}`)

        // address _countryMinter,
        // address _nationStrength,
        // address _military,
        // address _navyBattleAddress,
        // address _airBattleAddress,
        // address _groundBattle,
        // address _cruiseMissile,
        // address _forces,
        // address _wonders1,
        // address _keeper        

    const Wonders1 = await ethers.getContractFactory("WondersContract1")
    wonderscontract1 = await Wonders1.deploy() as WondersContract1
    await wonderscontract1.deployed()
    console.log(`Wonders1 deployed to ${wonderscontract1.address}`)
        // address _treasuryAddress,
        // address _wonderContract2Address,
        // address _wonderContract3Address,
        // address _wonderContract4Address,
        // address _infrastructureAddress

    const Wonders2 = await ethers.getContractFactory("WondersContract2")
    wonderscontract2 = await Wonders2.deploy() as WondersContract2
    await wonderscontract2.deployed()
    console.log(`Wonders2 deployed to ${wonderscontract2.address}`)
        // address _treasury,
        // address _infrastructure,
        // address _wonders1,
        // address _wonders3,
        // address _wonders4

    const Wonders3 = await ethers.getContractFactory("WondersContract3")
    wonderscontract3 = await Wonders3.deploy() as WondersContract3
    await wonderscontract3.deployed()
    console.log(`Wonders3 deployed to ${wonderscontract3.address}`)
        // address _treasuryAddress,
        // address _infrastructureAddress,
        // address _forces,
        // address _wonders1,
        // address _wonders2,
        // address _wonders4

    const Wonders4 = await ethers.getContractFactory("WondersContract4")
    wonderscontract4 = await Wonders4.deploy() as WondersContract4
    await wonderscontract4.deployed()
    console.log(`Wonders4 deployed to ${wonderscontract4.address}`)
        // address _treasuryAddress,
        // address _improvementsContract2Address,
        // address _improvementsContract3Address,
        // address _infrastructureAddress,
        // address _wonders1,
        // address _wonders3

    console.log("contracts deployed")

    await warbucks.settings(
        treasurycontract.address,
        countryminter.address
    )
    
    await aidcontract.settings(
        countryminter.address, 
        treasurycontract.address, 
        forcescontract.address, 
        infrastructurecontract.address, 
        keepercontract.address, 
        wonderscontract1.address,
        senatecontract.address,
        countryparameterscontract.address)

    await airbattlecontract.settings(
        warcontract.address, 
        fighterscontract.address, 
        bomberscontract.address, 
        infrastructurecontract.address, 
        forcescontract.address, 
        fighterlosses.address,
        countryminter.address,
        additionalairbattle.address
    )

    await additionalairbattle.settings(
        warcontract.address, 
        fighterscontract.address, 
        bomberscontract.address, 
        infrastructurecontract.address, 
        forcescontract.address, 
        fighterlosses.address,
        countryminter.address,
        airbattlecontract.address
    )
    
    await billscontract.settings(
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
    await billscontract.settings2(
        improvementscontract1.address,
        improvementscontract2.address,
        missilescontract.address,
        wonderscontract4.address,
        infrastructurecontract.address,
        bonusresourcescontract.address,
        navycontract2.address,
        countryparameterscontract.address)
    
    await bomberscontract.settings(
        countryminter.address, 
        bombersmarketplace1.address,
        bombersmarketplace2.address,
        airbattlecontract.address,
        treasurycontract.address,
        fighterscontract.address,
        infrastructurecontract.address,
        warcontract.address)

    await bombersmarketplace1.settings(
        countryminter.address,
        bomberscontract.address,
        fighterscontract.address,
        fightersmarketplace1.address,
        infrastructurecontract.address,
        treasurycontract.address)

    await bombersmarketplace2.settings(
        countryminter.address,
        bomberscontract.address,
        fighterscontract.address,
        fightersmarketplace1.address,
        infrastructurecontract.address,
        treasurycontract.address)
    
    await countryminter.settings(
        countryparameterscontract.address,
        treasurycontract.address,
        infrastructurecontract.address,
        resourcescontract.address,
        missilescontract.address,
        senatecontract.address,
        warbucks.address,
        bonusresourcescontract.address)
    await countryminter.settings2(
        improvementscontract1.address,
        improvementscontract2.address,
        improvementscontract3.address,
        improvementscontract4.address,
        wonderscontract1.address,
        wonderscontract2.address,
        wonderscontract3.address,
        wonderscontract4.address)
    await countryminter.settings3(
        militarycontract.address,
        forcescontract.address,
        navycontract.address,
        navycontract2.address,
        navalactionscontract.address,
        fighterscontract.address,
        bomberscontract.address)
    
    await countryparameterscontract.settings(
        spyoperationscontract.address,
        countryminter.address,
        senatecontract.address,
        keepercontract.address,
        nukecontract.address,
        groundbattlecontract.address,
        wonderscontract1.address,
        treasurycontract.address
    )

    await crimecontract.settings(
        infrastructurecontract.address,
        improvementscontract1.address,
        improvementscontract2.address,
        improvementscontract3.address,
        improvementscontract4.address,
        countryparameterscontract.address,
        wonderscontract2.address)
    
    await cruisemissilecontract.settings(
        forcescontract.address,
        countryminter.address,
        warcontract.address,
        infrastructurecontract.address,
        missilescontract.address)
    await cruisemissilecontract.settings2(
        improvementscontract1.address,
        improvementscontract3.address,
        improvementscontract4.address,
        wonderscontract2.address)
    
    await environmentcontract.settings(
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
    await environmentcontract.settings2(
        improvementscontract1.address,
        improvementscontract3.address,
        improvementscontract4.address,
        bonusresourcescontract.address)
    
    await fighterscontract.settings(
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
    await fighterscontract.settings2(
        navycontract.address,
        bomberscontract.address)
    
    await fighterlosses.settings(
        fighterscontract.address,
        airbattlecontract.address)
    
    await fightersmarketplace1.settings(
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
    await fightersmarketplace1.settings2(
        bonusresourcescontract.address,
        navycontract2.address
    )
    
    await fightersmarketplace2.settings(
        countryminter.address,
        bomberscontract.address,
        fighterscontract.address,
        fightersmarketplace1.address,
        treasurycontract.address,
        infrastructurecontract.address,
        resourcescontract.address,
        improvementscontract1.address)
    
    await forcescontract.settings(
        treasurycontract.address,
        aidcontract.address,
        spyoperationscontract.address,
        cruisemissilecontract.address,
        nukecontract.address,
        airbattlecontract.address,
        groundbattlecontract.address,
        warcontract.address)
    await forcescontract.settings2(
        infrastructurecontract.address,
        resourcescontract.address,
        improvementscontract1.address,
        improvementscontract2.address,
        wonderscontract1.address,
        countryminter.address,
        keepercontract.address,
        countryparameterscontract.address)
    
    await missilescontract.settings(
        treasurycontract.address,
        spyoperationscontract.address,
        nukecontract.address,
        airbattlecontract.address,
        wonderscontract2.address,
        nationstrengthcontract.address,
        infrastructurecontract.address)
    await missilescontract.settings2(
        resourcescontract.address,
        improvementscontract1.address,
        wonderscontract1.address,
        wonderscontract4.address,
        countryminter.address,
        keepercontract.address)
        
    await groundbattlecontract.settings(
        warcontract.address,
        infrastructurecontract.address,
        forcescontract.address,
        treasurycontract.address,
        countryminter.address,
        militarycontract.address)
    await groundbattlecontract.settings2(
        improvementscontract2.address,
        improvementscontract4.address,
        wonderscontract3.address,
        wonderscontract4.address,
        additionaltaxescontract.address,
        countryparameterscontract.address,)
    
    await improvementscontract1.settings(
        treasurycontract.address,
        improvementscontract2.address,
        improvementscontract3.address,
        improvementscontract4.address,
        navycontract.address,
        additionalnavycontract.address,
        countryminter.address,
        wonderscontract1.address,
        infrastructurecontract.address)

    await improvementscontract2.settings(
        treasurycontract.address,
        forcescontract.address,
        wonderscontract1.address,
        countryminter.address,
        improvementscontract1.address,
        resourcescontract.address,
        spycontract.address
        )
    
    await improvementscontract3.settings(
        treasurycontract.address,
        additionalnavycontract.address,
        improvementscontract1.address,
        improvementscontract2.address,
        countryminter.address,
        bonusresourcescontract.address,
        wonderscontract4.address
        )
    
    await improvementscontract4.settings(
        treasurycontract.address,
        forcescontract.address,
        improvementscontract1.address,
        improvementscontract2.address,
        countryminter.address,
        wonderscontract4.address
        )
    
    await infrastructurecontract.settings1(
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
    await infrastructurecontract.settings2(
        wonderscontract1.address,
        wonderscontract2.address,
        wonderscontract3.address,
        wonderscontract4.address,
        treasurycontract.address,
        countryparameterscontract.address,
        forcescontract.address,
        aidcontract.address
    )
    await infrastructurecontract.settings3(
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

    await infrastructuremarketplace.settings(
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

    await landmarketcontract.settings(
        resourcescontract.address,
        countryminter.address,
        infrastructurecontract.address,
        treasurycontract.address
    )

    await militarycontract.settings(
        spyoperationscontract.address,
        countryminter.address,
        keepercontract.address
    )

    await nationstrengthcontract.settings(
        infrastructurecontract.address,
        forcescontract.address,
        fighterscontract.address,
        bomberscontract.address,
        navycontract.address,
        missilescontract.address,
        navycontract2.address
    )

    await navycontract.settings(
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
    await navycontract.settings2(
        countryminter.address,
        bonusresourcescontract.address,
        navycontract2.address,
        infrastructurecontract.address
    )

    await navycontract2.settings(
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
    await navycontract2.settings2(
        countryminter.address,
        bonusresourcescontract.address,
        navycontract.address,
        infrastructurecontract.address
    )


    await navalactionscontract.settings(
        navalblockadecontract.address,
        breakblockadecontract.address,
        navalattackcontract.address,
        keepercontract.address,
        navycontract.address,
        navycontract2.address,
        countryminter.address
    )

    await additionalnavycontract.settings(
        navycontract.address,
        navalactionscontract.address,
        militarycontract.address,
        wonderscontract1.address,
        improvementscontract4.address,
        navycontract2.address
    )

    await navalblockadecontract.settings(
        navycontract.address,
        additionalnavycontract.address,
        navalactionscontract.address,
        warcontract.address,
        countryminter.address,
        keepercontract.address,
        breakblockadecontract.address
    )

    await breakblockadecontract.settings(
        countryminter.address,
        navalblockadecontract.address,
        navycontract.address,
        warcontract.address,
        improvementscontract4.address,
        navalactionscontract.address,
        navycontract2.address
    )

    await navalattackcontract.settings(
        navycontract.address,
        warcontract.address,
        improvementscontract4.address,
        navalactionscontract.address,
        navycontract2.address
    )

    await nukecontract.settings(
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
    await nukecontract.settings2(
        countryparameterscontract.address
    )

    await resourcescontract.settings(
        infrastructurecontract.address,
        improvementscontract2.address,
        countryminter.address,
        bonusresourcescontract.address,
        senatecontract.address,
        technologymarketcontrat.address,
        countryparameterscontract.address
    )
    await bonusresourcescontract.settings(
        infrastructurecontract.address,
        countryminter.address,
        resourcescontract.address,
        crimecontract.address
    )

    await senatecontract.settings(
        countryminter.address,
        countryparameterscontract.address,
        wonderscontract3.address,
        keepercontract.address,
        resourcescontract.address
    )

    await spycontract.settings(
        spyoperationscontract.address,
        treasurycontract.address,
        countryminter.address,
        improvementscontract2.address,
        wonderscontract1.address
        )

    await spyoperationscontract.settings(
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
    await spyoperationscontract.settings2(
        keepercontract.address,
        spycontract.address
    )

    await taxescontract.settings1(
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
    await taxescontract.settings2(
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

    await additionaltaxescontract.settings(
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
    await additionaltaxescontract.settings2(
        improvementscontract2.address,
        improvementscontract3.address,
        forcescontract.address,
    )

    await technologymarketcontrat.settings(
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

    await treasurycontract.settings1(
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
    await treasurycontract.settings2(
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
    await treasurycontract.settings3(
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

    await warcontract.settings(
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
    await warcontract.settings2(
        treasurycontract.address,
        forcescontract.address,
        navalblockadecontract.address,
        nukecontract.address
    )

    await wonderscontract1.settings(
        treasurycontract.address,
        wonderscontract2.address,
        wonderscontract3.address,
        wonderscontract4.address,
        infrastructurecontract.address,
        countryminter.address
    )

    await wonderscontract2.settings(
        treasurycontract.address,
        infrastructurecontract.address,
        wonderscontract1.address,
        wonderscontract3.address,
        wonderscontract4.address,
        countryminter.address
    )

    await wonderscontract3.settings(
        treasurycontract.address,
        infrastructurecontract.address,
        forcescontract.address,
        wonderscontract1.address,
        wonderscontract2.address,
        wonderscontract4.address,
        countryminter.address
    )

    await wonderscontract4.settings(
        treasurycontract.address,
        improvementscontract2.address,
        improvementscontract3.address,
        improvementscontract4.address,
        infrastructurecontract.address,
        wonderscontract1.address,
        wonderscontract3.address,
        countryminter.address
    )

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

        let MetaNationsGovTokenArtifact = await artifacts.readArtifact("MetaNationsGovToken")
        let MetaNationsGovTokenAbi = MetaNationsGovTokenArtifact.abi

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
        // if(chainId == fantomTestnetChainId) {
        
        // }
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
            metanationsgovtoken: {
                address: metanationsgovtoken.address,
                ABI: MetaNationsGovTokenAbi
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
            }
        };
        fs.writeFileSync(
            scriptMetadataLocation,
            JSON.stringify(scriptMetadata, null, 2)
        );
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
