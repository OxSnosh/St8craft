//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
import { expect } from "chai"
import { ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { INITIAL_SUPPLY } from "../helper-hardhat-config"
import { Test, Oracle } from "../typechain-types"
import { LinkToken } from '../typechain-types/@chainlink/contracts/src/v0.4/LinkToken';
import { link } from "fs"
import { metadata } from "../scripts/deploy_localhost_node/deploy_jobs/metadata";
import { jobId } from "../scripts/deploy_localhost_node/deploy_jobs/jobMetadata";
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
    BonusResourcesContract,
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
    VRFCoordinatorV2Mock
} from "../typechain-types"
// import operatorArtifact from "../artifacts/contracts/tests/Operator.sol/Operator.json";
// import OracleArtifact from "../artifacts/@chainlink/contracts/src/v0.4/Oracle.sol/Oracle.json";
import LinkTokenArtifact from "../artifacts/@chainlink/contracts/src/v0.4/LinkToken.sol/LinkToken.json";
import { networkConfig } from "../helper-hardhat-config"

describe("Country Minter", function () {
  
  // const oracleAbi = OracleArtifact.abi;
  // const linkTokenAbi = LinkTokenArtifact.abi;
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
  let signer2: SignerWithAddress
  let signer3: SignerWithAddress
  let signer4: SignerWithAddress
  let signer5: SignerWithAddress
  let signer6: SignerWithAddress
  let signer7: SignerWithAddress
  let signers: SignerWithAddress[]
  let addrs

  let vrfCoordinatorV2Mock: any
  let testContract: Test

  let linkToken: LinkToken;

  beforeEach(async function () {

    // console.log("hello world")

    signers = await ethers.getSigners();
    signer0 = signers[0];
    signer1 = signers[1];
    signer2 = signers[2];
    signer3 = signers[3];
    signer4 = signers[4];
    signer5 = signers[5];
    signer6 = signers[6];
    signer7 = signers[7];
    
    let chainId: any
    chainId = network.config.chainId
    let subscriptionId: any
    let vrfCoordinatorV2Address: any

    if (chainId == 31337 || chainId == 1337) {
        // console.log("local network detected")
        const FUND_AMOUNT = ethers.utils.parseEther("10")
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
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    var gasLane = networkConfig[31337]["gasLane"]
    var callbackGasLimit =  networkConfig[31337]["callbackGasLimit"]

    const WarBucks = await ethers.getContractFactory("WarBucks")
    warbucks = await WarBucks.deploy(INITIAL_SUPPLY) as WarBucks
    await warbucks.deployed()
    // console.log(`WarBuks token deployed to ${warbucks.address}`)

    const MetaNatonsGovToken = await ethers.getContractFactory(
        "MetaNationsGovToken"
    )
    st8craftgovtoken = await MetaNatonsGovToken.deploy(INITIAL_SUPPLY) as St8craftGovToken
    await st8craftgovtoken.deployed()
    // console.log(`MetaNationsGovToken deployed to ${metanationsgovtoken.address}`)

    const AidContract = await ethers.getContractFactory("AidContract")
    aidcontract = await AidContract.deploy() as AidContract
    await aidcontract.deployed()
    // console.log(`AidContract deployed tp ${aidcontract.address}`)
    
    const AirBattleContract = await ethers.getContractFactory("AirBattleContract")
    airbattlecontract = await AirBattleContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as AirBattleContract
    await airbattlecontract.deployed()
    // console.log(`AirBattleContract deployed tp ${airbattlecontract.address}`)

    const AdditionalAirBattleContract = await ethers.getContractFactory("AdditionalAirBattle")
    additionalairbattle = await AdditionalAirBattleContract.deploy() as AdditionalAirBattle
    await additionalairbattle.deployed()
    // console.log(`AirBattleContract deployed tp ${airbattlecontract.address}`)
        
    const BillsContract = await ethers.getContractFactory("BillsContract")
    billscontract = await BillsContract.deploy() as BillsContract
    await billscontract.deployed()
    // console.log(`BillsContract deployed tp ${billscontract.address}`)
        
    const BombersContract = await ethers.getContractFactory("BombersContract")
    bomberscontract = await BombersContract.deploy() as BombersContract
    await bomberscontract.deployed()
    // console.log(`BomberContract deployed tp ${bomberscontract.address}`)
        
    const BombersMarketplace1 = await ethers.getContractFactory("BombersMarketplace1")
    bombersmarketplace1 = await BombersMarketplace1.deploy() as BombersMarketplace1
    await bombersmarketplace1.deployed()
    // console.log(`BomberMarketplace1 deployed tp ${bombersmarketplace1.address}`)
        
    const BombersMarketplace2 = await ethers.getContractFactory("BombersMarketplace2")
    bombersmarketplace2 = await BombersMarketplace2.deploy() as BombersMarketplace2
    await bombersmarketplace2.deployed()
    // console.log(`BomberMarketplace2 deployed tp ${bombersmarketplace2.address}`)

    const CountryMinter = await ethers.getContractFactory("CountryMinter")
    countryminter = await CountryMinter.deploy()  as CountryMinter
    await countryminter.deployed()
    // console.log(`CountryMinter deployed tp ${countryminter.address}`)

    const CountryParameters = await ethers.getContractFactory("CountryParametersContract")
    countryparameterscontract = await CountryParameters.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as CountryParametersContract
    await countryparameterscontract.deployed()
    // console.log(`CountryParameters deployed to ${countryparameterscontract.address}`)

    const CrimeContract = await ethers.getContractFactory("CrimeContract")
    crimecontract = await CrimeContract.deploy() as CrimeContract
    await crimecontract.deployed()
    // console.log(`CrimeContract deployed tp ${crimecontract.address}`)

    const CruiseMissileContract = await ethers.getContractFactory("CruiseMissileContract")
    cruisemissilecontract = await CruiseMissileContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as CruiseMissileContract
    await cruisemissilecontract.deployed()
    // console.log(`CruiseMissile deployed to ${cruisemissileconract.address}`)

    const EnvironmentContract = await ethers.getContractFactory("EnvironmentContract")
    environmentcontract = await EnvironmentContract.deploy() as EnvironmentContract
    await environmentcontract.deployed()
    // console.log(`EnvironmentContract deployed to ${environmentcontract.address}`)

    const FightersContract = await ethers.getContractFactory("FightersContract")
    fighterscontract = await FightersContract.deploy() as FightersContract
    await fighterscontract.deployed()
    // console.log(`FightersContract deployed to ${fighterscontract.address}`)

    const FighterLosses = await ethers.getContractFactory("FighterLosses")
    fighterlosses = await FighterLosses.deploy() as FighterLosses
    await fighterlosses.deployed()
    // console.log(`FighterLosses deployed to ${fighterlosses.address}`)

    const FightersMarketplace1 = await ethers.getContractFactory("FightersMarketplace1")
    fightersmarketplace1 = await FightersMarketplace1.deploy() as FightersMarketplace1
    await fightersmarketplace1.deployed()
    // console.log(`FightersMarket1 deployed to ${fightersmarketplace1.address}`)

    const FightersMarketplace2 = await ethers.getContractFactory("FightersMarketplace2")
    fightersmarketplace2 = await FightersMarketplace2.deploy() as FightersMarketplace2
    await fightersmarketplace2.deployed()
    // console.log(`FightersMarket2 deployed to ${fightersmarketplace2.address}`)
        
    const ForcesContract = await ethers.getContractFactory("ForcesContract")
    forcescontract = await ForcesContract.deploy() as ForcesContract
    await forcescontract.deployed()
    // console.log(`ForcesContract deployed to ${forcescontract.address}`)

    const MissilesContract = await ethers.getContractFactory("MissilesContract")
    missilescontract = await MissilesContract.deploy() as MissilesContract
    await missilescontract.deployed()
    // console.log(`MissilesContract deployed to ${missilescontract.address}`)

    const GroundBattleContract = await ethers.getContractFactory("GroundBattleContract")
    groundbattlecontract = await GroundBattleContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as GroundBattleContract
    await groundbattlecontract.deployed()
    // console.log(`GroundBattleContract deployed to ${groundbattlecontract.address}`)
    
    const ImprovementsContract1 = await ethers.getContractFactory("ImprovementsContract1")
    improvementscontract1 = await ImprovementsContract1.deploy() as ImprovementsContract1
    await improvementscontract1.deployed()
    // console.log(`ImprovementsContract1 deployed to ${improvementscontract1.address}`)

    const ImprovementsContract2 = await ethers.getContractFactory("ImprovementsContract2")
    improvementscontract2 = await ImprovementsContract2.deploy() as ImprovementsContract2
    await improvementscontract2.deployed()
    // console.log(`ImprovementsContract2 deployed to ${improvementscontract2.address}`)

    const ImprovementsContract3 = await ethers.getContractFactory("ImprovementsContract3")
    improvementscontract3 = await ImprovementsContract3.deploy() as ImprovementsContract3
    await improvementscontract3.deployed()
    // console.log(`ImprovementsContract3 deployed to ${improvementscontract3.address}`)

    const ImprovementsContract4 = await ethers.getContractFactory("ImprovementsContract4")
    improvementscontract4 = await ImprovementsContract4.deploy() as ImprovementsContract4
    await improvementscontract4.deployed()
    // console.log(`ImprovementsContract4 deployed to ${improvementscontract4.address}`)
    
    const InfrastructureContract = await ethers.getContractFactory("InfrastructureContract")
    infrastructurecontract = await InfrastructureContract.deploy() as InfrastructureContract
    await infrastructurecontract.deployed()
    // console.log(`InfrastructureContract deployed to ${infrastructurecontract.address}`)

    const InfrastructureMarketContract = await ethers.getContractFactory("InfrastructureMarketContract")
    infrastructuremarketplace = await InfrastructureMarketContract.deploy() as InfrastructureMarketContract
    await infrastructuremarketplace.deployed()
    // console.log(`InfrastructureMarketplace deployed to ${infrastructuremarketplace.address}`)

    const KeeperContract = await ethers.getContractFactory("KeeperContract")
    keepercontract = await KeeperContract.deploy(86400) as KeeperContract
    await keepercontract.deployed()
    // console.log(`KeeperContract deployed to ${keepercontract.address}`)
    
    const LandMarketContract = await ethers.getContractFactory("LandMarketContract")
    landmarketcontract = await LandMarketContract.deploy() as LandMarketContract
    await landmarketcontract.deployed()
    // console.log(`LandMarketContract deployed to ${landmarketcontract.address}`)

    const MilitaryContract = await ethers.getContractFactory("MilitaryContract")
    militarycontract = await MilitaryContract.deploy() as MilitaryContract
    await militarycontract.deployed()
    // console.log(`MilitaryContract deployed to ${militarycontract.address}`)

    const NationStrengthContract = await ethers.getContractFactory("NationStrengthContract")
    nationstrengthcontract = await NationStrengthContract.deploy() as NationStrengthContract
    await nationstrengthcontract.deployed()
    // console.log(`NationStrengthContract deployed to ${nationstrengthcontract.address}`)

    const NavyContract = await ethers.getContractFactory("NavyContract")
    navycontract = await NavyContract.deploy() as NavyContract
    await navycontract.deployed()
    // console.log(`NavyContract deployed to ${navycontract.address}`)

    const NavyContract2 = await ethers.getContractFactory("NavyContract2")
    navycontract2 = await NavyContract2.deploy() as NavyContract2
    await navycontract2.deployed()
    // console.log(`NavyContract2 deployed to ${navycontract2.address}`)

    const AdditionalNavyContract = await ethers.getContractFactory("AdditionalNavyContract")
    additionalnavycontract = await AdditionalNavyContract.deploy() as AdditionalNavyContract
    await additionalnavycontract.deployed()
    // console.log(`NavyContract deployed to ${additionalnavycontract.address}`)
    
    const NavalActionsContract = await ethers.getContractFactory("NavalActionsContract")
    navalactionscontract = await NavalActionsContract.deploy() as NavalActionsContract
    await navalactionscontract.deployed()
    // console.log(`NavalActionsContract deployed to ${navalactionscontract.address}`)
    
    const NavalBlockadeContract = await ethers.getContractFactory("NavalBlockadeContract")
    navalblockadecontract = await NavalBlockadeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as NavalBlockadeContract
    await navalblockadecontract.deployed()
    // console.log(`NavalBlockadeContract deployed to ${navalblockadecontract.address}`)
    
    const BreakBlocadeContract = await ethers.getContractFactory("BreakBlocadeContract")
    breakblockadecontract = await BreakBlocadeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as BreakBlocadeContract
    await breakblockadecontract.deployed()
    // console.log(`BreakBlocadeContract deployed to ${breakblockadecontract.address}`)
        
    const NavalAttackContract = await ethers.getContractFactory("NavalAttackContract")
    navalattackcontract = await NavalAttackContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as NavalAttackContract
    await navalattackcontract.deployed()
    // console.log(`NavalAttackContract deployed to ${navalattackcontract.address}`)
    
    const NukeContract = await ethers.getContractFactory("NukeContract")
    nukecontract = await NukeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as NukeContract
    await nukecontract.deployed()
    // console.log(`NukeContract deployed to ${nukecontract.address}`)
    
    const ResourcesContract = await ethers.getContractFactory("ResourcesContract")
    resourcescontract = await ResourcesContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as ResourcesContract
    await resourcescontract.deployed()
    // console.log(`ResourcesContract deployed to ${resourcescontract.address}`)

    const BonusResourcesContract = await ethers.getContractFactory("BonusResourcesContract")
    bonusresourcescontract = await BonusResourcesContract.deploy() as BonusResourcesContract
    await bonusresourcescontract.deployed()

    const SenateContract = await ethers.getContractFactory("SenateContract")
    senatecontract = await SenateContract.deploy(20) as SenateContract
    await senatecontract.deployed()
    // console.log(`SenateContract deployed to ${senatecontract.address}`)

    const SpyContract = await ethers.getContractFactory("SpyContract")
    spycontract = await SpyContract.deploy() as SpyContract
    await spycontract.deployed()
    // console.log(`SpyContract deployed to ${spycontract.address}`)
    
    const SpyOperationsContract = await ethers.getContractFactory("SpyOperationsContract")
    spyoperationscontract = await SpyOperationsContract.deploy() as SpyOperationsContract
    await spyoperationscontract.deployed()
    // console.log(`SpyOperationsContract deployed to ${spyoperationscontract.address}`)

    const TaxesContract = await ethers.getContractFactory("TaxesContract")
    taxescontract = await TaxesContract.deploy() as TaxesContract
    await taxescontract.deployed()
    // console.log(`TaxesContract deployed to ${taxescontract.address}`)

    const AdditionalTaxesContract = await ethers.getContractFactory("AdditionalTaxesContract")
    additionaltaxescontract = await AdditionalTaxesContract.deploy() as AdditionalTaxesContract
    await additionaltaxescontract.deployed()
    // console.log(`AdditionalTaxesContract deployed to ${additionaltaxescontract.address}`)

    const TechnologyMarketContract = await ethers.getContractFactory("TechnologyMarketContract")
    technologymarketcontrat = await TechnologyMarketContract.deploy() as TechnologyMarketContract
    await technologymarketcontrat.deployed()
    // console.log(`TechnologyMarketContract deployed to ${technologymarketcontrat.address}`)

    const TreasuryContract = await ethers.getContractFactory("TreasuryContract")
    treasurycontract = await TreasuryContract.deploy() as TreasuryContract
    await treasurycontract.deployed()
    // console.log(`TreasuryContract deployed to ${treasurycontract.address}`)
    
    const WarContract = await ethers.getContractFactory("WarContract")
    warcontract = await WarContract.deploy() as WarContract
    await warcontract.deployed()
    // console.log(`WarContract deployed to ${warcontract.address}`)     

    const Wonders1 = await ethers.getContractFactory("WondersContract1")
    wonderscontract1 = await Wonders1.deploy() as WondersContract1
    await wonderscontract1.deployed()
    // console.log(`Wonders1 deployed to ${wonderscontract1.address}`)

    const Wonders2 = await ethers.getContractFactory("WondersContract2")
    wonderscontract2 = await Wonders2.deploy() as WondersContract2
    await wonderscontract2.deployed()
    // console.log(`Wonders2 deployed to ${wonderscontract2.address}`)

    const Wonders3 = await ethers.getContractFactory("WondersContract3")
    wonderscontract3 = await Wonders3.deploy() as WondersContract3
    await wonderscontract3.deployed()
    // console.log(`Wonders3 deployed to ${wonderscontract3.address}`)

    const Wonders4 = await ethers.getContractFactory("WondersContract4")
    wonderscontract4 = await Wonders4.deploy() as WondersContract4
    await wonderscontract4.deployed()
    // console.log(`Wonders4 deployed to ${wonderscontract4.address}`)

    // console.log("contracts deployed")

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
            countryparameterscontract.address,
            navalblockadecontract.address,)
        
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
            wonderscontract4.address,
            resourcescontract.address,
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
            navycontract2.address,
            navalblockadecontract.address,
            breakblockadecontract.address,
            navalattackcontract.address,
        )
    
        await navalblockadecontract.settings(
            navycontract.address,
            additionalnavycontract.address,
            navalactionscontract.address,
            warcontract.address,
            countryminter.address,
            keepercontract.address,
            breakblockadecontract.address,
            billscontract.address,
        )
    
        await breakblockadecontract.settings(
            countryminter.address,
            navalblockadecontract.address,
            navycontract.address,
            warcontract.address,
            improvementscontract4.address,
            navalactionscontract.address,
            navycontract2.address,
            additionalnavycontract.address,
        )
    
        await navalattackcontract.settings(
            navycontract.address,
            warcontract.address,
            improvementscontract4.address,
            navalactionscontract.address,
            navycontract2.address,
            additionalnavycontract.address,
            countryminter.address,
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
            wonderscontract1.address,
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
            countryminter.address,
            resourcescontract.address,
        )
    
        await wonderscontract3.settings(
            treasurycontract.address,
            infrastructurecontract.address,
            forcescontract.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract4.address,
            countryminter.address,
            resourcescontract.address,
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

        if(chainId == 31337 || chainId == 1337) {
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, resourcescontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, countryparameterscontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, groundbattlecontract.address);
        }

        // console.log("country 1");
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(2100000000000000000000000))
        await countryminter.connect(signer1).generateCountry(
            "TestRuler",
            "TestNationName",
            "TestCapitalCity",
            "TestNationSlogan"
        )    

        await warbucks.connect(signer0).transfer(signer2.address, BigInt(2100000000000000000000000))
        await countryminter.connect(signer2).generateCountry(
            "TestRuler2",
            "TestNationName2",
            "TestCapitalCity2",
            "TestNationSlogan2"
        )   

    });

    describe("Deposit and Withdraw Functionality", function () {
        it("deployer balance is initiated correctly", async function () {
            let deployerBalanceGross : any = (await (warbucks.balanceOf(signer0.address))).toString();
            let deployerBalance = (BigInt(deployerBalanceGross / (10**18)));
            // console.log("deployer balance", deployerBalance);
            expect(deployerBalance.toString()).to.equal("29995800000");
        })

        it("tests addFunds() will increase game balance and burn coins", async function () {
            await warbucks.connect(signer0).approve(warbucks.address, BigInt(500000000*(10**18)));
            await warbucks.connect(signer0).transfer(signer1.address, BigInt(500000000*(10**18)));
            let updatedSigner1CoinBalanceGross : any = await warbucks.balanceOf(signer1.address);
            let updatedSigner1CoinBalance = (BigInt(updatedSigner1CoinBalanceGross / (10**18)));
            // console.log("Signer1 New Coin Balance", BigInt(updatedSigner1CoinBalance.toString()));
            expect(updatedSigner1CoinBalance.toString()).to.equal("500100000");
            let signer1InitialGameBalanceGross : any = await treasurycontract.checkBalance(0);
            let signer1InitialGameBalance = (BigInt(signer1InitialGameBalanceGross / (10**18)));
            expect(signer1InitialGameBalance.toString()).to.equal("2000000");
            // console.log("signer1 initial game balance", BigInt(signer1InitialGameBalance.toString()));
            await treasurycontract.connect(signer1).addFunds(BigInt(500000000*(10**18)), 0);
            let signer1UpdatedGameBalanceGross : any = await treasurycontract.checkBalance(0);
            let signer1UpdatedGameBalance = (BigInt(signer1UpdatedGameBalanceGross / (10**18)));
            expect(signer1UpdatedGameBalance.toString()).to.equal("502000000");
            // console.log("signer1 game balance after adding funds", BigInt(signer1UpdatedGameBalance.toString()));
            let signer1UpdatedCoinBalanceAfterBurn = await warbucks.balanceOf(signer1.address);
            expect(signer1UpdatedCoinBalanceAfterBurn.toString()).to.equal("100000000000000125829120");
            // console.log("signer1 updates coin balance after burn", BigInt(signer1UpdatedCoinBalanceAfterBurn.toString()));
        })

        it("tests addFunds() will revert with insufficient coin balance", async function () {
            await warbucks.connect(signer0).approve(warbucks.address, BigInt(500000000*(10**18)));
            await warbucks.connect(signer0).transfer(signer1.address, BigInt(500000000*(10**18)));
            await expect(treasurycontract.connect(signer1).addFunds(BigInt(10000000000*(10**18)), 0)).to.be.revertedWith("deposit amount exceeds balance in wallet");
        })

        it("tests addFunds() will revert with !nation owner caller", async function () {
            await warbucks.connect(signer0).approve(warbucks.address, BigInt(500000000*(10**18)));
            await warbucks.connect(signer0).transfer(signer1.address, BigInt(500000000*(10**18)));
            await expect(treasurycontract.connect(signer1).addFunds(BigInt(500000000*(10**18)), 1)).to.be.revertedWith("!nation owner");
        })

        it("tests withdrawFunds() will decrease game balance and mint coins", async function () {
            // await warbucks.connect(signer0).approve(warbucks.address, BigInt(500000000*(10**18)));
            await warbucks.connect(signer0).transfer(signer1.address, BigInt(500000000*(10**18)));
            let updatedSigner1CoinBalanceGross : any = await warbucks.balanceOf(signer1.address);
            let updatedSigner1CoinBalance = (BigInt(updatedSigner1CoinBalanceGross / (10**18)));
            // console.log("Signer1 New Coin Balance", BigInt(updatedSigner1CoinBalance.toString()));
            expect(updatedSigner1CoinBalance.toString()).to.equal("500100000");
            let signer1InitialGameBalanceGross : any = await treasurycontract.checkBalance(0);
            let signer1InitialGameBalance = (BigInt(signer1InitialGameBalanceGross / (10**18)));
            expect(signer1InitialGameBalance.toString()).to.equal("2000000");
            // console.log("signer1 initial game balance", BigInt(signer1InitialGameBalance.toString()));
            await treasurycontract.connect(signer1).addFunds(BigInt(500000000*(10**18)), 0);
            let signer1UpdatedGameBalanceGross : any = await treasurycontract.checkBalance(0);
            let signer1UpdatedGameBalance = (BigInt(signer1UpdatedGameBalanceGross / (10**18)));
            expect(signer1UpdatedGameBalance.toString()).to.equal("502000000");
            // console.log("signer1 game balance after adding funds", BigInt(signer1UpdatedGameBalance.toString()));
            let signer1UpdatedCoinBalanceAfterBurn = await warbucks.balanceOf(signer1.address);
            expect(signer1UpdatedCoinBalanceAfterBurn.toString()).to.equal("100000000000000125829120");
            // console.log("signer1 updates coin balance after burn", BigInt(signer1UpdatedCoinBalanceAfterBurn.toString()));
            await billscontract.connect(signer1).payBills(0);
            await treasurycontract.connect(signer1).withdrawFunds(BigInt(500000000*(10**18)), 0);
            let coinBalanceAfterWithdrawGross : any = await warbucks.balanceOf(signer1.address);
            let coinBalanceAfterWithdraw = (BigInt(coinBalanceAfterWithdrawGross / (10**18)));
            // console.log("coin balance after withdraw", coinBalanceAfterWithdraw);
            expect (coinBalanceAfterWithdraw.toString()).to.equal("500100000");
            let gameBalanceAfterWithdrawGross : any = await treasurycontract.checkBalance(0);
            let gameBalanceAfterWithdraw = (BigInt(gameBalanceAfterWithdrawGross / (10**18)));
            // console.log("game balance after withdraw", gameBalanceAfterWithdraw);
            expect(gameBalanceAfterWithdraw.toString()).to.equal("2000000");
        })

        it("tests withdrawFunds() will revert with !nation owner caller", async function () {
            await warbucks.connect(signer0).transfer(signer1.address, BigInt(500000000*(10**18)));
            await treasurycontract.connect(signer1).addFunds(BigInt(500000000*(10**18)), 0);
            await expect(treasurycontract.connect(signer1).withdrawFunds(BigInt(100), 1)).to.be.revertedWith("!nation owner");
        })

        it("tests withdrawFunds() will revert with insufficient game balance", async function () {
            await warbucks.connect(signer0).transfer(signer1.address, BigInt(500000000*(10**18)));
            await treasurycontract.connect(signer1).addFunds(BigInt(500000000*(10**18)), 0);
            await billscontract.connect(signer1).payBills(0);
            await expect(treasurycontract.connect(signer1).withdrawFunds(BigInt(50000000000*(10**18)), 0)).to.be.revertedWith("insufficient game balance");
        })

        it("tests that the Seed Money amount can be changed", async function () {
            let seedMoney : any = await treasurycontract.getSeedMoney();
            expect(BigInt(seedMoney).toString()).to.equal("2000000000000000000000000");
            await treasurycontract.updateSeedMoney(1000000);
            let seedMoney2 : any = await treasurycontract.getSeedMoney();
            expect(BigInt(seedMoney2).toString()).to.equal("1000000000000000000000000");
        })
    })

    describe("MILF Functionality", function () {
        it("Tests that the setMilf() function works correctly", async function () {
            let gameTaxRate1 = await treasurycontract.getSilt();
            // console.log("Tax Rate Initial", gameTaxRate1.toNumber());
            expect(gameTaxRate1.toNumber()).to.equal(0);
            await treasurycontract.setSilt(50);
            let gameTaxRate2 = await treasurycontract.getSilt();
            expect(gameTaxRate2.toNumber()).to.equal(50);
            // console.log("Tax Rate Updated", gameTaxRate2.toNumber());
            let initialTaxRevenue = await treasurycontract.viewSiltRevenues();
            // console.log("Initial Balance", initialTaxRevenue.toNumber());
            expect(initialTaxRevenue.toNumber()).to.equal(0);
            // await warbucks.connect(signer0).approve(warbucks.address, BigInt(10000000000*(10**18)));
            await warbucks.connect(signer0).transfer(signer1.address, BigInt(10000000000*(10**18)));
            var cost : any = await infrastructuremarketplace.connect(signer1).getInfrastructureCost(0, 100);
            // console.log(BigInt(cost), "cost");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 100);
            let afterTaxRevenue : any = await treasurycontract.viewSiltRevenues();
            // console.log("After Transaction Tax Balance", afterTaxRevenue.toNumber());
            expect(BigInt(afterTaxRevenue).toString()).to.equal("37000000000000000000000");
        })

        it("Tests that the owner can withdraw game taxes from the treasury contract", async function () {
            await treasurycontract.setSilt(50);
            let ownerInitialWarBucksBalance : any = await warbucks.balanceOf(signer0.address);
            // console.log("First Balance", BigInt(ownerInitialWarBucksBalance));
            await warbucks.connect(signer0).approve(warbucks.address, BigInt(ownerInitialWarBucksBalance));
            await warbucks.connect(signer0).transfer(signer1.address, BigInt(ownerInitialWarBucksBalance));
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 100);
            let taxRevenue = await treasurycontract.viewSiltRevenues();
            // console.log(taxRevenue.toString());
            await treasurycontract.connect(signer0).withdrawSiltRevenues(1000000);
            let taxRevenueAfterWithdrawal = await treasurycontract.viewSiltRevenues();
            // console.log(taxRevenueAfterWithdrawal.toNumber());
            // expect(taxRevenueAfterWithdrawal.toNumber()).to.equal(0);
            let ownerWarBucksBalance : any = await warbucks.balanceOf(signer0.address);
            expect(ownerWarBucksBalance.toNumber()).to.equal(1000000);
            // console.log("Second Balance", ownerWarBucksBalance.toNumber());
        })
    })

    describe("Tax Functionality", function () {
        it("tests that daysSinceLastTaxCollection works when days since is greater than max tax days", async function () {
            var daysSinceLastTaxCollection = await treasurycontract.getDaysSinceLastTaxCollection(0);
            // console.log("Days since last tax collection", daysSinceLastTaxCollection.toNumber());
            expect(daysSinceLastTaxCollection.toNumber()).to.equal(0);
            //increase 21 days
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            var daysSinceLastTaxCollection = await treasurycontract.getDaysSinceLastTaxCollection(0);
            // console.log("Days since last tax collection", daysSinceLastTaxCollection.toNumber());
            expect(daysSinceLastTaxCollection.toNumber()).to.equal(20);
        })

        it("test that maxDaysOfTaxes can be updated", async function () {
            let maxDaysOfTaxes = await treasurycontract.getMaxDaysOfTaxes();
            // console.log("max days of taxes", maxDaysOfTaxes.toNumber());
            expect(maxDaysOfTaxes.toNumber()).to.equal(20);
            await treasurycontract.setMaxDaysOfTaxes(30);
            let maxDaysOfTaxes2 = await treasurycontract.getMaxDaysOfTaxes();
            // console.log("max days of taxes", maxDaysOfTaxes2.toNumber());
            expect(maxDaysOfTaxes2.toNumber()).to.equal(30);
        })

        it("tests that taxes can be collected", async function () {
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            let taxesCollectible : any = await taxescontract.getTaxesCollectible(0);
            console.log("taxes collectible", (taxesCollectible / (10**18)));
            await militarycontract.connect(signer1).toggleWarPeacePreference(0);
            await taxescontract.connect(signer1).collectTaxes(0);
        })
    })

    describe("Days To Inactive", function () {
        it("tests that days to inactive can be changed and a nation can be inactive", async function () {
            var inactive = await treasurycontract.checkInactive(0);
            console.log("inactive", inactive);
            expect(inactive).to.equal(false);
            await treasurycontract.setDaysToInactive(10);
            var daysToInactive = await treasurycontract.getDaysToInactive();
            console.log("days to inactive", daysToInactive.toNumber());
            expect(daysToInactive.toNumber()).to.equal(10);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            var inactive = await treasurycontract.checkInactive(0);
            console.log("inactive", inactive);
            expect(inactive).to.equal(false);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            var inactive = await treasurycontract.checkInactive(0);
            console.log("inactive", inactive);
            expect(inactive).to.equal(true);
        })

        it("tests that inactive nations can be reactivated", async function () {
            await treasurycontract.setDaysToInactive(10);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            var inactive = await treasurycontract.checkInactive(0);
            console.log("inactive", inactive);
            expect(inactive).to.equal(true);
            await billscontract.connect(signer1).payBills(0);
            var inactive = await treasurycontract.checkInactive(0);
            console.log("inactive", inactive);
            expect(inactive).to.equal(false);
        })
    })

    describe("Demonitize Nation", function () {
        it("tests that a nation can be demonitized", async function () {
            var demonitized = await treasurycontract.isNationDemonetized(0);
            console.log("demonitized", demonitized);
            expect(demonitized).to.equal(false);
            await treasurycontract.demonetizeNation(0);
            var demonitized = await treasurycontract.isNationDemonetized(0);
            console.log("demonitized", demonitized);
            expect(demonitized).to.equal(true);
        })

        it("tests that a demonitized nation can be re-monetized", async function () {
            await treasurycontract.demonetizeNation(0);
            var demonitized = await treasurycontract.isNationDemonetized(0);
            console.log("demonitized", demonitized);
            expect(demonitized).to.equal(true);
            await treasurycontract.remonetizeNation(0);
            var demonitized = await treasurycontract.isNationDemonetized(0);
            console.log("demonitized", demonitized);
            expect(demonitized).to.equal(false);
        })
    })

    describe("Total Game Balance", function () {
        it("tests that the total game balance can be viewed", async function () {
            let totalGameBalanceGross : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance = (BigInt(totalGameBalanceGross / (10**18)));
            console.log("total game balance", totalGameBalance.toString());
        })

        it("total game balance updates when a nation adds funds", async function () {
            let totalGameBalanceGross : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance = (BigInt(totalGameBalanceGross / (10**18)));
            console.log("total game balance", totalGameBalance.toString());
            await warbucks.connect(signer0).transfer(signer1.address, BigInt(500000000*(10**18)));
            await treasurycontract.connect(signer1).addFunds(BigInt(500000000*(10**18)), 0);
            let totalGameBalanceGross2 : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance2 = (BigInt(totalGameBalanceGross2 / (10**18)));
            console.log("total game balance", totalGameBalance2.toString());
            expect(totalGameBalance2.toString()).to.equal("504000000");
        })

        it("total game balance updates when a nation withdraws funds", async function () {
            let totalGameBalanceGross : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance = (BigInt(totalGameBalanceGross / (10**18)));
            console.log("total game balance", totalGameBalance.toString());
            await warbucks.connect(signer0).transfer(signer1.address, BigInt(500000000*(10**18)));
            await treasurycontract.connect(signer1).addFunds(BigInt(500000000*(10**18)), 0);
            let totalGameBalanceGross2 : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance2 = (BigInt(totalGameBalanceGross2 / (10**18)));
            console.log("total game balance", totalGameBalance2.toString());
            expect(totalGameBalance2.toString()).to.equal("504000000");
            await billscontract.connect(signer1).payBills(0);
            await treasurycontract.connect(signer1).withdrawFunds(BigInt(500000000*(10**18)), 0);
            let totalGameBalanceGross3 : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance3 = (BigInt(totalGameBalanceGross3 / (10**18)));
            console.log("total game balance", totalGameBalance3.toString());
            expect(totalGameBalance3.toString()).to.equal("4000000");
        })

        it("total game balance updates when a nation collects taxes", async function () {
            let totalGameBalanceGross : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance = (BigInt(totalGameBalanceGross / (10**18)));
            console.log("total game balance", totalGameBalance.toString());
            await warbucks.connect(signer0).transfer(signer1.address, BigInt(500000000*(10**18)));
            await treasurycontract.connect(signer1).addFunds(BigInt(500000000*(10**18)), 0);
            let totalGameBalanceGross2 : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance2 = (BigInt(totalGameBalanceGross2 / (10**18)));
            console.log("total game balance", totalGameBalance2.toString());
            expect(totalGameBalance2.toString()).to.equal("504000000");
            await billscontract.connect(signer1).payBills(0);
            await treasurycontract.connect(signer1).withdrawFunds(BigInt(500000000*(10**18)), 0);
            let totalGameBalanceGross3 : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance3 = (BigInt(totalGameBalanceGross3 / (10**18)));
            console.log("total game balance", totalGameBalance3.toString());
            expect(totalGameBalance3.toString()).to.equal("4000000");
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await militarycontract.connect(signer1).toggleWarPeacePreference(0);
            await taxescontract.connect(signer1).collectTaxes(0);
            let totalGameBalanceGross4 : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance4 = (BigInt(totalGameBalanceGross4 / (10**18)));
            console.log("total game balance", totalGameBalance4.toString());
            expect(totalGameBalance4.toString()).to.equal("4002877");
        })

        it("total game balance updates when a nation pays bills", async function () {
            let totalGameBalanceGross : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance = (BigInt(totalGameBalanceGross / (10**18)));
            console.log("total game balance", totalGameBalance.toString());
            await warbucks.connect(signer0).transfer(signer1.address, BigInt(500000000*(10**18)));
            await treasurycontract.connect(signer1).addFunds(BigInt(500000000*(10**18)), 0);
            let totalGameBalanceGross2 : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance2 = (BigInt(totalGameBalanceGross2 / (10**18)));
            console.log("total game balance", totalGameBalance2.toString());
            expect(totalGameBalance2.toString()).to.equal("504000000");
            await billscontract.connect(signer1).payBills(0);
            await treasurycontract.connect(signer1).withdrawFunds(BigInt(500000000*(10**18)), 0);
            let totalGameBalanceGross3 : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance3 = (BigInt(totalGameBalanceGross3 / (10**18)));
            console.log("total game balance", totalGameBalance3.toString());
            expect(totalGameBalance3.toString()).to.equal("4000000");
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await militarycontract.connect(signer1).toggleWarPeacePreference(0);
            await taxescontract.connect(signer1).collectTaxes(0);
            let totalGameBalanceGross4 : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance4 = (BigInt(totalGameBalanceGross4 / (10**18)));
            console.log("total game balance", totalGameBalance4.toString());
            expect(totalGameBalance4.toString()).to.equal("4002877");
            await billscontract.connect(signer1).payBills(0);
            let totalGameBalanceGross5 : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance5 = (BigInt(totalGameBalanceGross5 / (10**18)));
            console.log("total game balance", totalGameBalance5.toString());
            expect(totalGameBalance5.toString()).to.equal("4001557");
        })

        it("total game balance updates when a nation buys spends money", async function () {
            let totalGameBalanceGross : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance = (BigInt(totalGameBalanceGross / (10**18)));
            console.log("total game balance", totalGameBalance.toString());
            await warbucks.connect(signer0).transfer(signer1.address, BigInt(500000000*(10**18)));
            await treasurycontract.connect(signer1).addFunds(BigInt(500000000*(10**18)), 0);
            let totalGameBalanceGross2 : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance2 = (BigInt(totalGameBalanceGross2 / (10**18)));
            console.log("total game balance", totalGameBalance2.toString());
            expect(totalGameBalance2.toString()).to.equal("504000000");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
            let totalGameBalanceGross3 : any = await treasurycontract.getTotalGameBalance();
            let totalGameBalance3 = (BigInt(totalGameBalanceGross3 / (10**18)));
            console.log("total game balance", totalGameBalance3.toString());
            // expect(totalGameBalance3.toString()).to.equal("503000000");    
        })
    })

    describe("Outside Contract Calls", function () {
        it("tests that the Aid Contract can send balance", async function () {
            await warbucks.connect(signer0).approve(warbucks.address, BigInt(100000000*(10**18)));
            await warbucks.connect(signer0).transfer(signer1.address, BigInt(100000000*(10**18)));
            await treasurycontract.connect(signer1).addFunds(BigInt(100000000*(10**18)), 0);
            await aidcontract.connect(signer1).proposeAid(0, 1, 0, BigInt(6000000*(10**18)), 0);
            var balance = await treasurycontract.checkBalance(1);
            // console.log("balance", balance.toString());
            expect(balance.toString()).to.equal("2000000000000000000000000");
            await aidcontract.connect(signer2).acceptProposal(0);
            var balance = await treasurycontract.checkBalance(1);
            // console.log("balance", balance.toString());
            expect(balance.toString()).to.equal("7999999999999999899336704");
        })

        
        // it("tests that Infrastructure contract can return balance when land is sold", async function () {
        //     await warbucks.connect(signer0).approve(warbucks.address, BigInt(100000000*(10**18)));
        //     await warbucks.connect(signer0).transfer(signer1.address, BigInt(100000000*(10**18)));
        //     await treasurycontract.connect(signer1).addFunds(BigInt(100000000*(10**18)), 0);
        //     await landmarketcontract.connect(signer1).buyLand(0, 500);
        //     var balance = await treasurycontract.checkBalance(0);
        //     // console.log("balance", balance.toString());
        //     expect(balance.toString()).to.equal("101780000000000004764729344");
        //     await infrastructurecontract.connect(signer1).sellLand(0, 300);
        //     var balance = await treasurycontract.checkBalance(0);
        //     // console.log("balance", balance.toString());
        //     expect(balance.toString()).to.equal("101810000000000004764729344");
        // })
        
        //External Adapter Required
        
        // it("tests that a ground battle will transfer money spoils", async function () {
        //     await warbucks.connect(signer0).approve(warbucks.address, BigInt(10000000000*(10**18)));
        //     await warbucks.connect(signer0).transfer(signer1.address, BigInt(10000000000*(10**18)));
        //     await treasurycontract.connect(signer1).addFunds(BigInt(10000000000*(10**18)), 0);
        //     await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 5000)
        //     await technologymarketcontrat.connect(signer1).buyTech(0, 100)
        //     await forcescontract.connect(signer1).buySoldiers(2000, 0)
        //     await forcescontract.connect(signer1).buyTanks(40, 0)

        //     await warbucks.connect(signer0).approve(warbucks.address, BigInt(2000000000*(10**18)));
        //     await warbucks.connect(signer0).transfer(signer2.address, BigInt(2000000000*(10**18)));
        //     await treasurycontract.connect(signer2).addFunds(BigInt(2000000000*(10**18)), 1);
        //     await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 5000)
        //     await technologymarketcontrat.connect(signer2).buyTech(1, 100)
        //     await forcescontract.connect(signer2).buySoldiers(1000, 1)
        //     await forcescontract.connect(signer2).buyTanks(20, 1)

        //     await militarycontract.connect(signer1).toggleWarPeacePreference(0)
        //     await militarycontract.connect(signer2).toggleWarPeacePreference(1)
        //     await warcontract.connect(signer1).declareWar(0, 1)
        //     await forcescontract.connect(signer1).deployForces(1000, 30, 0, 0)

        //     await forcescontract.connect(signer1).buySoldiers(20000, 0)
        //     await forcescontract.connect(signer1).buyTanks(400, 0)

        //     var balance = await treasurycontract.checkBalance(0)
        //     console.log(BigInt(balance.toString()), "balance")

        //     await groundbattlecontract.connect(signer1).groundAttack(0, 0, 1, 1)

        //     const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
        //     const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
        //     for (const log of event1Logs) {
        //         const requestIdReturn = log.args.requestId;
        //         console.log(Number(requestIdReturn), "requestIdReturn for Event");
        //         if (requestIdReturn == 5) {
        //             await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, groundbattlecontract.address);

        //         }
        //     }

        //     var attackVictory = await groundbattlecontract.returnAttackVictorious(0);
        //     // expect(attackVictory).to.equal(false);
        //     console.log(attackVictory, "attacker victory")

        //     var balance2 = await treasurycontract.checkBalance(0)
        //     console.log(BigInt(balance2.toString()), "balance")
        // })
    })
    
});