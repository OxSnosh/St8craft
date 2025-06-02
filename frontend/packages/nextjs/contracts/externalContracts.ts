import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";
import metadata from "../../../../backend/script-metadata.json";
import { Address } from "viem";
import { Abi, AbiParameter } from "abitype";
import { AllianceManager } from '../../../../backend/typechain-types/contracts/CountryParameters.sol/AllianceManager';

const fixAbi = (abi: any[]): Abi => {
  return abi.map((entry) => {
    if (entry.inputs) {
      entry.inputs = entry.inputs.map((input: AbiParameter) => ({
        ...input,
        name: input.name || "", // Provide a default name if undefined
      }));
    }
    return entry;
  });
};

const externalContracts: GenericContractsDeclaration = {
  31337: {
    CountryMinter: {
      address: metadata.HARDHAT.countryminter.address as Address,
      abi: fixAbi(metadata.HARDHAT.countryminter.ABI)
    },
    WarBucks: {
      address: metadata.HARDHAT.warbucks.address as Address,
      abi: fixAbi(metadata.HARDHAT.warbucks.ABI)
    },
    MetaNationsGovToken: {
      address: metadata.HARDHAT.metanationsgovtoken.address as Address,
      abi: fixAbi(metadata.HARDHAT.metanationsgovtoken.ABI)
    },
    AidContract: {
      address: metadata.HARDHAT.aidcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.aidcontract.ABI)
    },
    AirBattleContract: {
      address: metadata.HARDHAT.airbattlecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.airbattlecontract.ABI)
    },
    AdditionalAirBattle: {  
      address: metadata.HARDHAT.additionalairbattle.address as Address,
      abi: fixAbi(metadata.HARDHAT.additionalairbattle.ABI)
    },
    BillsContract: {
      address: metadata.HARDHAT.billscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.billscontract.ABI)
    },
    BombersContract: {
      address: metadata.HARDHAT.bomberscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.bomberscontract.ABI)
    },
    BombersMarketplace1 : {
      address: metadata.HARDHAT.bombersmarketplace1.address as Address,
      abi: fixAbi(metadata.HARDHAT.bombersmarketplace1.ABI)
    },
    BombersMarketplace2 : { 
      address: metadata.HARDHAT.bombersmarketplace2.address as Address,
      abi: fixAbi(metadata.HARDHAT.bombersmarketplace2.ABI)
    },
    CountryParametersContract : {
      address: metadata.HARDHAT.countryparameterscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.countryparameterscontract.ABI)
    },
    CrimeContract : {
      address: metadata.HARDHAT.crimecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.crimecontract.ABI)
    },
    CruiseMissileContract : {
      address: metadata.HARDHAT.cruisemissilecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.cruisemissilecontract.ABI)
    },
    EnvironmentContract : { 
      address: metadata.HARDHAT.environmentcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.environmentcontract.ABI)
    },
    FightersContract : {
      address: metadata.HARDHAT.fighterscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.fighterscontract.ABI)
    },
    FighterLosses : {
      address: metadata.HARDHAT.fighterlosses.address as Address,
      abi: fixAbi(metadata.HARDHAT.fighterlosses.ABI)
    },
    FightersMarketplace1 : {  
      address: metadata.HARDHAT.fightersmarketplace1.address as Address,
      abi: fixAbi(metadata.HARDHAT.fightersmarketplace1.ABI)
    },
    FightersMarketplace2 : {  
      address: metadata.HARDHAT.fightersmarketplace2.address as Address,
      abi: fixAbi(metadata.HARDHAT.fightersmarketplace2.ABI)
    },
    ForcesContract : {
      address: metadata.HARDHAT.forcescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.forcescontract.ABI)
    },
    MissilesContract  : {
      address: metadata.HARDHAT.missilescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.missilescontract.ABI)
    },
    GroundBattleContract : {
      address: metadata.HARDHAT.groundbattlecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.groundbattlecontract.ABI)
    },
    ImprovementsContract1 : {
      address: metadata.HARDHAT.improvementscontract1.address as Address,
      abi: fixAbi(metadata.HARDHAT.improvementscontract1.ABI)
    },
    ImprovementsContract2 : {
      address: metadata.HARDHAT.improvementscontract2.address as Address,
      abi: fixAbi(metadata.HARDHAT.improvementscontract2.ABI)
    },
    ImprovementsContract3 : {
      address: metadata.HARDHAT.improvementscontract3.address as Address,
      abi: fixAbi(metadata.HARDHAT.improvementscontract3.ABI)
    },
    ImprovementsContract4 : {
      address: metadata.HARDHAT.improvementscontract4.address as Address,
      abi: fixAbi(metadata.HARDHAT.improvementscontract4.ABI)
    },
    InfrastructureContract  : {
      address: metadata.HARDHAT.infrastructurecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.infrastructurecontract.ABI)
    },
    InfrastructureMarketContract  : {
      address: metadata.HARDHAT.infrastructuremarketplace.address as Address,
      abi: fixAbi(metadata.HARDHAT.infrastructuremarketplace.ABI)
    },
    KeeperContract : {
      address: metadata.HARDHAT.keepercontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.keepercontract.ABI)
    },
    LandMarketContract : {
      address: metadata.HARDHAT.landmarketcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.landmarketcontract.ABI)
    },
    MilitaryContract : {
      address: metadata.HARDHAT.militarycontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.militarycontract.ABI)
    },
    NationStrengthContract : {
      address: metadata.HARDHAT.nationstrengthcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.nationstrengthcontract.ABI)
    },
    NavyContract : {
      address: metadata.HARDHAT.navycontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.navycontract.ABI)
    },
    NavyContract2 : {
      address: metadata.HARDHAT.navycontract2.address as Address,
      abi: fixAbi(metadata.HARDHAT.navycontract2.ABI)
    },
    AdditionalNavyContract : {
      address: metadata.HARDHAT.additionalnavycontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.additionalnavycontract.ABI)
    },
    NavalActionsContract : {  
      address: metadata.HARDHAT.navalactionscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.navalactionscontract.ABI)
    },
    NavalBlockadeContract : {
      address: metadata.HARDHAT.navalblockadecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.navalblockadecontract.ABI)
    },
    BreakBlockadeContract : {
      address: metadata.HARDHAT.breakblockadecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.breakblockadecontract.ABI)
    },
    NavalAttackContract : {
      address: metadata.HARDHAT.navalattackcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.navalattackcontract.ABI)
    },
    NukeContract : {
      address: metadata.HARDHAT.nukecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.nukecontract.ABI)
    },
    ResourcesContract : {
      address: metadata.HARDHAT.resourcescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.resourcescontract.ABI)
    },
    BonusResourcesContract : {
      address: metadata.HARDHAT.bonusresourcescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.bonusresourcescontract.ABI)
    },
    SenateContract : {
      address: metadata.HARDHAT.senatecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.senatecontract.ABI)
    },
    SpyContract : {
      address: metadata.HARDHAT.spycontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.spycontract.ABI)
    },
    SpyOperationsContract : {
      address: metadata.HARDHAT.spyoperationscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.spyoperationscontract.ABI)
    },
    TaxesContract : {
      address: metadata.HARDHAT.taxescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.taxescontract.ABI)
    },
    AdditionalTaxesContract : {
      address: metadata.HARDHAT.additionaltaxescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.additionaltaxescontract.ABI)
    },
    TechnologyMarketContract : {
      address: metadata.HARDHAT.technologymarketcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.technologymarketcontract.ABI)
    },
    TreasuryContract : {
      address: metadata.HARDHAT.treasurycontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.treasurycontract.ABI)
    },
    WarContract : {
      address: metadata.HARDHAT.warcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.warcontract.ABI)
    },
    WondersContract1 : {
      address: metadata.HARDHAT.wonderscontract1.address as Address,
      abi: fixAbi(metadata.HARDHAT.wonderscontract1.ABI)
    },
    WondersContract2 : {
      address: metadata.HARDHAT.wonderscontract2.address as Address,
      abi: fixAbi(metadata.HARDHAT.wonderscontract2.ABI)
    },
    WondersContract3  : {
      address: metadata.HARDHAT.wonderscontract3.address as Address,
      abi: fixAbi(metadata.HARDHAT.wonderscontract3.ABI)
    },
    WondersContract4 : {
      address: metadata.HARDHAT.wonderscontract4.address as Address,
      abi: fixAbi(metadata.HARDHAT.wonderscontract4.ABI)
    },    
    Messenger : {
      address: metadata.HARDHAT.messenger.address as Address,
      abi: fixAbi(metadata.HARDHAT.messenger.ABI)
    },
  },
  84532: {
    CountryMinter: {
      address: metadata.BASESEPOLIA.countryminter.address as Address,
      abi: fixAbi(metadata.HARDHAT.countryminter.ABI)
    },
    WarBucks: {
      address: metadata.BASESEPOLIA.warbucks.address as Address,
      abi: fixAbi(metadata.HARDHAT.warbucks.ABI)
    },
    St8craftGovToken: {
      address: metadata.BASESEPOLIA.st8craftgovtoken.address as Address,
      abi: fixAbi(metadata.HARDHAT.st8craftgovtoken.ABI)
    },
    AidContract: {
      address: metadata.BASESEPOLIA.aidcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.aidcontract.ABI)
    },
    AirBattleContract: {
      address: metadata.BASESEPOLIA.airbattlecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.airbattlecontract.ABI)
    },
    AdditionalAirBattle: {  
      address: metadata.BASESEPOLIA.additionalairbattle.address as Address,
      abi: fixAbi(metadata.HARDHAT.additionalairbattle.ABI)
    },
    BillsContract: {
      address: metadata.BASESEPOLIA.billscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.billscontract.ABI)
    },
    BombersContract: {
      address: metadata.BASESEPOLIA.bomberscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.bomberscontract.ABI)
    },
    BombersMarketplace1 : {
      address: metadata.BASESEPOLIA.bombersmarketplace1.address as Address,
      abi: fixAbi(metadata.HARDHAT.bombersmarketplace1.ABI)
    },
    BombersMarketplace2 : { 
      address: metadata.BASESEPOLIA.bombersmarketplace2.address as Address,
      abi: fixAbi(metadata.HARDHAT.bombersmarketplace2.ABI)
    },
    CountryParametersContract : {
      address: metadata.BASESEPOLIA.countryparameterscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.countryparameterscontract.ABI)
    },
    CrimeContract : {
      address: metadata.BASESEPOLIA.crimecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.crimecontract.ABI)
    },
    CruiseMissileContract : {
      address: metadata.BASESEPOLIA.cruisemissilecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.cruisemissilecontract.ABI)
    },
    EnvironmentContract : { 
      address: metadata.BASESEPOLIA.environmentcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.environmentcontract.ABI)
    },
    FightersContract : {
      address: metadata.BASESEPOLIA.fighterscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.fighterscontract.ABI)
    },
    FighterLosses : {
      address: metadata.BASESEPOLIA.fighterlosses.address as Address,
      abi: fixAbi(metadata.HARDHAT.fighterlosses.ABI)
    },
    FightersMarketplace1 : {  
      address: metadata.BASESEPOLIA.fightersmarketplace1.address as Address,
      abi: fixAbi(metadata.HARDHAT.fightersmarketplace1.ABI)
    },
    FightersMarketplace2 : {  
      address: metadata.BASESEPOLIA.fightersmarketplace2.address as Address,
      abi: fixAbi(metadata.HARDHAT.fightersmarketplace2.ABI)
    },
    ForcesContract : {
      address: metadata.BASESEPOLIA.forcescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.forcescontract.ABI)
    },
    MissilesContract  : {
      address: metadata.BASESEPOLIA.missilescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.missilescontract.ABI)
    },
    GroundBattleContract : {
      address: metadata.BASESEPOLIA.groundbattlecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.groundbattlecontract.ABI)
    },
    ImprovementsContract1 : {
      address: metadata.BASESEPOLIA.improvementscontract1.address as Address,
      abi: fixAbi(metadata.HARDHAT.improvementscontract1.ABI)
    },
    ImprovementsContract2 : {
      address: metadata.BASESEPOLIA.improvementscontract2.address as Address,
      abi: fixAbi(metadata.HARDHAT.improvementscontract2.ABI)
    },
    ImprovementsContract3 : {
      address: metadata.BASESEPOLIA.improvementscontract3.address as Address,
      abi: fixAbi(metadata.HARDHAT.improvementscontract3.ABI)
    },
    ImprovementsContract4 : {
      address: metadata.BASESEPOLIA.improvementscontract4.address as Address,
      abi: fixAbi(metadata.HARDHAT.improvementscontract4.ABI)
    },
    InfrastructureContract  : {
      address: metadata.BASESEPOLIA.infrastructurecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.infrastructurecontract.ABI)
    },
    InfrastructureMarketContract  : {
      address: metadata.BASESEPOLIA.infrastructuremarketplace.address as Address,
      abi: fixAbi(metadata.HARDHAT.infrastructuremarketplace.ABI)
    },
    KeeperContract : {
      address: metadata.BASESEPOLIA.keepercontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.keepercontract.ABI)
    },
    LandMarketContract : {
      address: metadata.BASESEPOLIA.landmarketcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.landmarketcontract.ABI)
    },
    MilitaryContract : {
      address: metadata.BASESEPOLIA.militarycontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.militarycontract.ABI)
    },
    NationStrengthContract : {
      address: metadata.BASESEPOLIA.nationstrengthcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.nationstrengthcontract.ABI)
    },
    NavyContract : {
      address: metadata.BASESEPOLIA.navycontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.navycontract.ABI)
    },
    NavyContract2 : {
      address: metadata.BASESEPOLIA.navycontract2.address as Address,
      abi: fixAbi(metadata.HARDHAT.navycontract2.ABI)
    },
    AdditionalNavyContract : {
      address: metadata.BASESEPOLIA.additionalnavycontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.additionalnavycontract.ABI)
    },
    NavalActionsContract : {  
      address: metadata.BASESEPOLIA.navalactionscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.navalactionscontract.ABI)
    },
    NavalBlockadeContract : {
      address: metadata.BASESEPOLIA.navalblockadecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.navalblockadecontract.ABI)
    },
    BreakBlockadeContract : {
      address: metadata.BASESEPOLIA.breakblockadecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.breakblockadecontract.ABI)
    },
    NavalAttackContract : {
      address: metadata.BASESEPOLIA.navalattackcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.navalattackcontract.ABI)
    },
    NukeContract : {
      address: metadata.BASESEPOLIA.nukecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.nukecontract.ABI)
    },
    ResourcesContract : {
      address: metadata.BASESEPOLIA.resourcescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.resourcescontract.ABI)
    },
    BonusResourcesContract : {
      address: metadata.BASESEPOLIA.bonusresourcescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.bonusresourcescontract.ABI)
    },
    SenateContract : {
      address: metadata.BASESEPOLIA.senatecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.senatecontract.ABI)
    },
    SpyContract : {
      address: metadata.BASESEPOLIA.spycontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.spycontract.ABI)
    },
    SpyOperationsContract : {
      address: metadata.BASESEPOLIA.spyoperationscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.spyoperationscontract.ABI)
    },
    TaxesContract : {
      address: metadata.BASESEPOLIA.taxescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.taxescontract.ABI)
    },
    AdditionalTaxesContract : {
      address: metadata.BASESEPOLIA.additionaltaxescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.additionaltaxescontract.ABI)
    },
    TechnologyMarketContract : {
      address: metadata.BASESEPOLIA.technologymarketcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.technologymarketcontract.ABI)
    },
    TreasuryContract : {
      address: metadata.BASESEPOLIA.treasurycontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.treasurycontract.ABI)
    },
    WarContract : {
      address: metadata.BASESEPOLIA.warcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.warcontract.ABI)
    },
    WondersContract1 : {
      address: metadata.BASESEPOLIA.wonderscontract1.address as Address,
      abi: fixAbi(metadata.HARDHAT.wonderscontract1.ABI)
    },
    WondersContract2 : {
      address: metadata.BASESEPOLIA.wonderscontract2.address as Address,
      abi: fixAbi(metadata.HARDHAT.wonderscontract2.ABI)
    },
    WondersContract3  : {
      address: metadata.BASESEPOLIA.wonderscontract3.address as Address,
      abi: fixAbi(metadata.HARDHAT.wonderscontract3.ABI)
    },
    WondersContract4 : {
      address: metadata.BASESEPOLIA.wonderscontract4.address as Address,
      abi: fixAbi(metadata.HARDHAT.wonderscontract4.ABI)
    },    
    Messenger : {
      address: metadata.BASESEPOLIA.messenger.address as Address,
      abi: fixAbi(metadata.HARDHAT.messenger.ABI)
    },
    AllianceManager: {
      address: metadata.BASESEPOLIA.alliancemanager.address as Address,
      abi: fixAbi(metadata.HARDHAT.alliancemanger.ABI) as Abi
    }
  }
};

export default externalContracts;
