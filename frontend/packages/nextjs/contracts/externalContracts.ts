import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";
import { Address } from "viem";
import { Abi, AbiParameter } from "abitype";
import CountryMinter_local from "../../../../backend/deployments/localhost/CountryMinter.json";
import WarBucks_local from "../../../../backend/deployments/localhost/WarBucks.json";
import St8craftGovToken_local from "../../../../backend/deployments/localhost/St8craftGovToken.json";
import AidContract_local from "../../../../backend/deployments/localhost/AidContract.json";
import AirBattleContract_local from "../../../../backend/deployments/localhost/AirBattleContract.json";
import AdditionalAirBattle_local from "../../../../backend/deployments/localhost/AdditionalAirBattle.json";
import BillsContract_local from "../../../../backend/deployments/localhost/BillsContract.json";
import BombersContract_local from "../../../../backend/deployments/localhost/BombersContract.json";
import BombersMarketplace1_local from "../../../../backend/deployments/localhost/BombersMarketplace1.json";
import BombersMarketplace2_local from "../../../../backend/deployments/localhost/BombersMarketplace2.json";
import CountryParametersContract_local from "../../../../backend/deployments/localhost/CountryParametersContract.json";
import CrimeContract_local from "../../../../backend/deployments/localhost/CrimeContract.json";
import CruiseMissileContract_local from "../../../../backend/deployments/localhost/CruiseMissileContract.json";
import EnvironmentContract_local from "../../../../backend/deployments/localhost/EnvironmentContract.json"; 
import FightersContract_local from "../../../../backend/deployments/localhost/FightersContract.json";
import FighterLosses_local from "../../../../backend/deployments/localhost/FighterLosses.json";
import FightersMarketplace1_local from "../../../../backend/deployments/localhost/FightersMarketplace1.json";
import FightersMarketplace2_local from "../../../../backend/deployments/localhost/FightersMarketplace2.json";
import ForcesContract_local from "../../../../backend/deployments/localhost/ForcesContract.json";
import MissilesContract_local from "../../../../backend/deployments/localhost/MissilesContract.json";
import GroundBattleContract_local from "../../../../backend/deployments/localhost/GroundBattleContract.json";
import ImprovementsContract1_local from "../../../../backend/deployments/localhost/ImprovementsContract1.json";
import ImprovementsContract2_local from "../../../../backend/deployments/localhost/ImprovementsContract2.json";
import ImprovementsContract3_local from "../../../../backend/deployments/localhost/ImprovementsContract3.json";
import ImprovementsContract4_local from "../../../../backend/deployments/localhost/ImprovementsContract4.json";
import InfrastructureContract_local from "../../../../backend/deployments/localhost/InfrastructureContract.json";
import InfrastructureMarketContract_local from "../../../../backend/deployments/localhost/InfrastructureMarketContract.json";
import KeeperContract_local from "../../../../backend/deployments/localhost/KeeperContract.json";
import LandMarketContract_local from "../../../../backend/deployments/localhost/LandMarketContract.json";
import MilitaryContract_local from "../../../../backend/deployments/localhost/MilitaryContract.json";
import NationStrengthContract_local from "../../../../backend/deployments/localhost/NationStrengthContract.json";
import NavyContract_local from "../../../../backend/deployments/localhost/NavyContract.json";
import NavyContract2_local from "../../../../backend/deployments/localhost/NavyContract2.json";
import AdditionalNavyContract_local from "../../../../backend/deployments/localhost/AdditionalNavyContract.json";
import NavalActionsContract_local from "../../../../backend/deployments/localhost/NavalActionsContract.json";
import NavalBlockadeContract_local from "../../../../backend/deployments/localhost/NavalBlockadeContract.json";
import BreakBlockadeContract_local from "../../../../backend/deployments/localhost/BreakBlocadeContract.json";
import NavalAttackContract_local from "../../../../backend/deployments/localhost/NavalAttackContract.json";
import NukeContract_local from "../../../../backend/deployments/localhost/NukeContract.json";
import ResourcesContract_local from "../../../../backend/deployments/localhost/ResourcesContract.json";
import BonusResourcesContract_local from "../../../../backend/deployments/localhost/BonusResourcesContract.json";
import SenateContract_local from "../../../../backend/deployments/localhost/SenateContract.json";
import SpyContract_local from "../../../../backend/deployments/localhost/SpyContract.json";
import SpyOperationsContract_local from "../../../../backend/deployments/localhost/SpyOperationsContract.json";
import TaxesContract_local from "../../../../backend/deployments/localhost/TaxesContract.json";
import AdditionalTaxesContract_local from "../../../../backend/deployments/localhost/AdditionalTaxesContract.json";
import TechnologyMarketContract_local from "../../../../backend/deployments/localhost/TechnologyMarketContract.json";
import TreasuryContract_local from "../../../../backend/deployments/localhost/TreasuryContract.json";
import WarContract_local from "../../../../backend/deployments/localhost/WarContract.json";
import WondersContract1_local from "../../../../backend/deployments/localhost/WondersContract1.json";
import WondersContract2_local from "../../../../backend/deployments/localhost/WondersContract2.json";
import WondersContract3_local from "../../../../backend/deployments/localhost/WondersContract3.json";
import WondersContract4_local from "../../../../backend/deployments/localhost/WondersContract4.json";
import Messenger_local from "../../../../backend/deployments/localhost/Messenger.json";
import AllianceManager_local from "../../../../backend/deployments/localhost/AllianceManager.json";
import CountryMinter from "../../../../backend/deployments/base_sepolia/CountryMinter.json";
import WarBucks from "../../../../backend/deployments/base_sepolia/WarBucks.json";
import St8craftGovToken from "../../../../backend/deployments/base_sepolia/St8craftGovToken.json";
import AidContract from "../../../../backend/deployments/base_sepolia/AidContract.json";
import AirBattleContract from "../../../../backend/deployments/base_sepolia/AirBattleContract.json";
import AdditionalAirBattle from "../../../../backend/deployments/base_sepolia/AdditionalAirBattle.json";
import BillsContract from "../../../../backend/deployments/base_sepolia/BillsContract.json";
import BombersContract from "../../../../backend/deployments/base_sepolia/BombersContract.json";
import BombersMarketplace1 from "../../../../backend/deployments/base_sepolia/BombersMarketplace1.json";
import BombersMarketplace2 from "../../../../backend/deployments/base_sepolia/BombersMarketplace2.json";
import CountryParametersContract from "../../../../backend/deployments/base_sepolia/CountryParametersContract.json";
import CrimeContract from "../../../../backend/deployments/base_sepolia/CrimeContract.json";
import CruiseMissileContract from "../../../../backend/deployments/base_sepolia/CruiseMissileContract.json";
import EnvironmentContract from "../../../../backend/deployments/base_sepolia/EnvironmentContract.json";
import FightersContract from "../../../../backend/deployments/base_sepolia/FightersContract.json";
import FighterLosses from "../../../../backend/deployments/base_sepolia/FighterLosses.json";
import FightersMarketplace1 from "../../../../backend/deployments/base_sepolia/FightersMarketplace1.json";
import FightersMarketplace2 from "../../../../backend/deployments/base_sepolia/FightersMarketplace2.json";
import ForcesContract from "../../../../backend/deployments/base_sepolia/ForcesContract.json";
import MissilesContract from "../../../../backend/deployments/base_sepolia/MissilesContract.json";
import GroundBattleContract from "../../../../backend/deployments/base_sepolia/GroundBattleContract.json";
import ImprovementsContract1 from "../../../../backend/deployments/base_sepolia/ImprovementsContract1.json";
import ImprovementsContract2 from "../../../../backend/deployments/base_sepolia/ImprovementsContract2.json";
import ImprovementsContract3 from "../../../../backend/deployments/base_sepolia/ImprovementsContract3.json";
import ImprovementsContract4 from "../../../../backend/deployments/base_sepolia/ImprovementsContract4.json";
import InfrastructureContract from "../../../../backend/deployments/base_sepolia/InfrastructureContract.json";
import InfrastructureMarketContract from "../../../../backend/deployments/base_sepolia/InfrastructureMarketContract.json";
import KeeperContract from "../../../../backend/deployments/base_sepolia/KeeperContract.json";
import LandMarketContract from "../../../../backend/deployments/base_sepolia/LandMarketContract.json";
import MilitaryContract from "../../../../backend/deployments/base_sepolia/MilitaryContract.json";
import NationStrengthContract from "../../../../backend/deployments/base_sepolia/NationStrengthContract.json";
import NavyContract from "../../../../backend/deployments/base_sepolia/NavyContract.json";
import NavyContract2 from "../../../../backend/deployments/base_sepolia/NavyContract2.json";
import AdditionalNavyContract from "../../../../backend/deployments/base_sepolia/AdditionalNavyContract.json";
import NavalActionsContract from "../../../../backend/deployments/base_sepolia/NavalActionsContract.json";
import NavalBlockadeContract from "../../../../backend/deployments/base_sepolia/NavalBlockadeContract.json";
import BreakBlockadeContract from "../../../../backend/deployments/base_sepolia/BreakBlocadeContract.json";
import NavalAttackContract from "../../../../backend/deployments/base_sepolia/NavalAttackContract.json";
import NukeContract from "../../../../backend/deployments/base_sepolia/NukeContract.json";
import ResourcesContract from "../../../../backend/deployments/base_sepolia/ResourcesContract.json";
import BonusResourcesContract from "../../../../backend/deployments/base_sepolia/BonusResourcesContract.json";
import SenateContract from "../../../../backend/deployments/base_sepolia/SenateContract.json";
import SpyContract from "../../../../backend/deployments/base_sepolia/SpyContract.json";
import SpyOperationsContract from "../../../../backend/deployments/base_sepolia/SpyOperationsContract.json";
import TaxesContract from "../../../../backend/deployments/base_sepolia/TaxesContract.json";
import AdditionalTaxesContract from "../../../../backend/deployments/base_sepolia/AdditionalTaxesContract.json";
import TechnologyMarketContract from "../../../../backend/deployments/base_sepolia/TechnologyMarketContract.json";
import TreasuryContract from "../../../../backend/deployments/base_sepolia/TreasuryContract.json";
import WarContract from "../../../../backend/deployments/base_sepolia/WarContract.json";
import WondersContract1 from "../../../../backend/deployments/base_sepolia/WondersContract1.json";
import WondersContract2 from "../../../../backend/deployments/base_sepolia/WondersContract2.json";
import WondersContract3 from "../../../../backend/deployments/base_sepolia/WondersContract3.json";
import WondersContract4 from "../../../../backend/deployments/base_sepolia/WondersContract4.json";
import Messenger from "../../../../backend/deployments/base_sepolia/Messenger.json";
import AllianceManager from "../../../../backend/deployments/base_sepolia/AllianceManager.json";


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
      address: CountryMinter_local.address as Address,
      abi: fixAbi(CountryMinter_local.abi)
    },
    WarBucks: {
      address: WarBucks_local.address as Address,
      abi: fixAbi(WarBucks_local.abi)
    },
    St8craftGovToken: {
      address: St8craftGovToken_local.address as Address,
      abi: fixAbi(St8craftGovToken_local.abi)
    },
    AidContract: {
      address: AidContract_local.address as Address,
      abi: fixAbi(AidContract_local.abi)
    },
    AirBattleContract: {
      address: AirBattleContract_local.address as Address,
      abi: fixAbi(AirBattleContract_local.abi)
    },
    AdditionalAirBattle: {  
      address: AdditionalAirBattle_local.address as Address,
      abi: fixAbi(AdditionalAirBattle_local.abi)
    },
    BillsContract: {
      address: BillsContract_local.address as Address,
      abi: fixAbi(BillsContract_local.abi)
    },
    BombersContract: {
      address: BombersContract_local.address as Address,
      abi: fixAbi(BombersContract_local.abi)
    },
    BombersMarketplace1 : {
      address: BombersMarketplace1_local.address as Address,
      abi: fixAbi(BombersMarketplace1_local.abi)
    },
    BombersMarketplace2 : { 
      address: BombersMarketplace2_local.address as Address,
      abi: fixAbi(BombersMarketplace2_local.abi)
    },
    CountryParametersContract : {
      address: CountryParametersContract_local.address as Address,
      abi: fixAbi(CountryParametersContract_local.abi)
    },
    CrimeContract : {
      address: CrimeContract_local.address as Address,
      abi: fixAbi(CrimeContract_local.abi)
    },
    CruiseMissileContract : {
      address: CruiseMissileContract_local.address as Address,
      abi: fixAbi(CruiseMissileContract_local.abi)
    },
    EnvironmentContract : { 
      address: EnvironmentContract_local.address as Address,
      abi: fixAbi(EnvironmentContract_local.abi)
    },
    FightersContract : {
      address: FightersContract_local.address as Address,
      abi: fixAbi(FightersContract_local.abi)
    },
    FighterLosses : {
      address: FighterLosses_local.address as Address,
      abi: fixAbi(FighterLosses_local.abi)
    },
    FightersMarketplace1 : {  
      address: FightersMarketplace1_local.address as Address,
      abi: fixAbi(FightersMarketplace1_local.abi)
    },
    FightersMarketplace2 : {  
      address: FightersMarketplace2_local.address as Address,
      abi: fixAbi(FightersMarketplace2_local.abi)
    },
    ForcesContract : {
      address: ForcesContract_local.address as Address,
      abi: fixAbi(ForcesContract_local.abi)
    },
    MissilesContract  : {
      address: MissilesContract_local.address as Address,
      abi: fixAbi(MissilesContract_local.abi)
    },
    GroundBattleContract : {
      address: GroundBattleContract_local.address as Address,
      abi: fixAbi(GroundBattleContract_local.abi)
    },
    ImprovementsContract1 : {
      address: ImprovementsContract1_local.address as Address,
      abi: fixAbi(ImprovementsContract1_local.abi)
    },
    ImprovementsContract2 : {
      address: ImprovementsContract2_local.address as Address,
      abi: fixAbi(ImprovementsContract2_local.abi)
    },
    ImprovementsContract3 : {
      address: ImprovementsContract3_local.address as Address,
      abi: fixAbi(ImprovementsContract3_local.abi)
    },
    ImprovementsContract4 : {
      address: ImprovementsContract4_local.address as Address,
      abi: fixAbi(ImprovementsContract4_local.abi)
    },
    InfrastructureContract  : {
      address: InfrastructureContract_local.address as Address,
      abi: fixAbi(InfrastructureContract_local.abi)
    },
    InfrastructureMarketContract  : {
      address: InfrastructureMarketContract_local.address as Address,
      abi: fixAbi(InfrastructureMarketContract_local.abi)
    },
    KeeperContract : {
      address: KeeperContract_local.address as Address,
      abi: fixAbi(KeeperContract_local.abi)
    },
    LandMarketContract : {
      address: LandMarketContract_local.address as Address,
      abi: fixAbi(LandMarketContract_local.abi)
    },
    MilitaryContract : {
      address: MilitaryContract_local.address as Address,
      abi: fixAbi(MilitaryContract_local.abi)
    },
    NationStrengthContract : {
      address: NationStrengthContract_local.address as Address,
      abi: fixAbi(NationStrengthContract_local.abi)
    },
    NavyContract : {
      address: NavyContract_local.address as Address,
      abi: fixAbi(NavyContract_local.abi)
    },
    NavyContract2 : {
      address: NavyContract2_local.address as Address,
      abi: fixAbi(NavyContract2_local.abi)
    },
    AdditionalNavyContract : {
      address: AdditionalNavyContract_local.address as Address,
      abi: fixAbi(AdditionalNavyContract_local.abi)
    },
    NavalActionsContract : {  
      address: NavalActionsContract_local.address as Address,
      abi: fixAbi(NavalActionsContract_local.abi)
    },
    NavalBlockadeContract : {
      address: NavalBlockadeContract_local.address as Address,
      abi: fixAbi(NavalBlockadeContract_local.abi)
    },
    BreakBlockadeContract : {
      address: BreakBlockadeContract_local.address as Address,
      abi: fixAbi(BreakBlockadeContract_local.abi)
    },
    NavalAttackContract : {
      address: NavalAttackContract_local.address as Address,
      abi: fixAbi(NavalAttackContract_local.abi)
    },
    NukeContract : {
      address: NukeContract_local.address as Address,
      abi: fixAbi(NukeContract_local.abi)
    },
    ResourcesContract : {
      address: ResourcesContract_local.address as Address,
      abi: fixAbi(ResourcesContract_local.abi)
    },
    BonusResourcesContract : {
      address: BonusResourcesContract_local.address as Address,
      abi: fixAbi(BonusResourcesContract_local.abi)
    },
    SenateContract : {
      address: SenateContract_local.address as Address,
      abi: fixAbi(SenateContract_local.abi)
    },
    SpyContract : {
      address: SpyContract_local.address as Address,
      abi: fixAbi(SpyContract_local.abi)
    },
    SpyOperationsContract : {
      address: SpyOperationsContract_local.address as Address,
      abi: fixAbi(SpyOperationsContract_local.abi)
    },
    TaxesContract : {
      address: TaxesContract_local.address as Address,
      abi: fixAbi(TaxesContract_local.abi)
    },
    AdditionalTaxesContract : {
      address: AdditionalTaxesContract_local.address as Address,
      abi: fixAbi(AdditionalTaxesContract_local.abi)
    },
    TechnologyMarketContract : {
      address: TechnologyMarketContract_local.address as Address,
      abi: fixAbi(TechnologyMarketContract_local.abi)
    },
    TreasuryContract : {
      address: TreasuryContract_local.address as Address,
      abi: fixAbi(TreasuryContract_local.abi)
    },
    WarContract : {
      address: WarContract_local.address as Address,
      abi: fixAbi(WarContract_local.abi)
    },
    WondersContract1 : {
      address: WondersContract1_local.address as Address,
      abi: fixAbi(WondersContract1_local.abi)
    },
    WondersContract2 : {
      address: WondersContract2_local.address as Address,
      abi: fixAbi(WondersContract2_local.abi)
    },
    WondersContract3  : {
      address: WondersContract3_local.address as Address,
      abi: fixAbi(WondersContract3_local.abi)
    },
    WondersContract4 : {
      address: WondersContract4_local.address as Address,
      abi: fixAbi(WondersContract4_local.abi)
    },    
    Messenger : {
      address: Messenger_local.address as Address,
      abi: fixAbi(Messenger_local.abi)
    },
    AllianceManager: {
      address: AllianceManager_local.address as Address,
      abi: fixAbi(AllianceManager_local.abi)
    }
  },
  84532: {
    CountryMinter: {
      address: CountryMinter.address as Address,
      abi: fixAbi(CountryMinter.abi)
    },
    WarBucks: {
      address: WarBucks.address as Address,
      abi: fixAbi(WarBucks.abi)
    },
    St8craftGovToken: {
      address: St8craftGovToken.address as Address,
      abi: fixAbi(St8craftGovToken.abi)
    },
    AidContract: {
      address: AidContract.address as Address,
      abi: fixAbi(AidContract.abi)
    },
    AirBattleContract: {
      address: AirBattleContract.address as Address,
      abi: fixAbi(AirBattleContract.abi)
    },
    AdditionalAirBattle: {  
      address: AdditionalAirBattle.address as Address,
      abi: fixAbi(AdditionalAirBattle.abi)
    },
    BillsContract: {
      address: BillsContract.address as Address,
      abi: fixAbi(BillsContract.abi)
    },
    BombersContract: {
      address: BombersContract.address as Address,
      abi: fixAbi(BombersContract.abi)
    },
    BombersMarketplace1 : {
      address: BombersMarketplace1.address as Address,
      abi: fixAbi(BombersMarketplace1.abi)
    },
    BombersMarketplace2 : { 
      address: BombersMarketplace2.address as Address,
      abi: fixAbi(BombersMarketplace2.abi)
    },
    CountryParametersContract : {
      address: CountryParametersContract.address as Address,
      abi: fixAbi(CountryParametersContract.abi)
    },
    CrimeContract : {
      address: CrimeContract.address as Address,
      abi: fixAbi(CrimeContract.abi)
    },
    CruiseMissileContract : {
      address: CruiseMissileContract.address as Address,
      abi: fixAbi(CruiseMissileContract.abi)
    },
    EnvironmentContract : { 
      address: EnvironmentContract.address as Address,
      abi: fixAbi(EnvironmentContract.abi)
    },
    FightersContract : {
      address: FightersContract.address as Address,
      abi: fixAbi(FightersContract.abi)
    },
    FighterLosses : {
      address: FighterLosses.address as Address,
      abi: fixAbi(FighterLosses.abi)
    },
    FightersMarketplace1 : {  
      address: FightersMarketplace1.address as Address,
      abi: fixAbi(FightersMarketplace1.abi)
    },
    FightersMarketplace2 : {  
      address: FightersMarketplace2.address as Address,
      abi: fixAbi(FightersMarketplace2.abi)
    },
    ForcesContract : {
      address: ForcesContract.address as Address,
      abi: fixAbi(ForcesContract.abi)
    },
    MissilesContract  : {
      address: MissilesContract.address as Address,
      abi: fixAbi(MissilesContract.abi)
    },
    GroundBattleContract : {
      address: GroundBattleContract.address as Address,
      abi: fixAbi(GroundBattleContract.abi)
    },
    ImprovementsContract1 : {
      address: ImprovementsContract1.address as Address,
      abi: fixAbi(ImprovementsContract1.abi)
    },
    ImprovementsContract2 : {
      address: ImprovementsContract2.address as Address,
      abi: fixAbi(ImprovementsContract2.abi)
    },
    ImprovementsContract3 : {
      address: ImprovementsContract3.address as Address,
      abi: fixAbi(ImprovementsContract3.abi)
    },
    ImprovementsContract4 : {
      address: ImprovementsContract4.address as Address,
      abi: fixAbi(ImprovementsContract4.abi)
    },
    InfrastructureContract  : {
      address: InfrastructureContract.address as Address,
      abi: fixAbi(InfrastructureContract.abi)
    },
    InfrastructureMarketContract  : {
      address: InfrastructureMarketContract.address as Address,
      abi: fixAbi(InfrastructureMarketContract.abi)
    },
    KeeperContract : {
      address: KeeperContract.address as Address,
      abi: fixAbi(KeeperContract.abi)
    },
    LandMarketContract : {
      address: LandMarketContract.address as Address,
      abi: fixAbi(LandMarketContract.abi)
    },
    MilitaryContract : {
      address: MilitaryContract.address as Address,
      abi: fixAbi(MilitaryContract.abi)
    },
    NationStrengthContract : {
      address: NationStrengthContract.address as Address,
      abi: fixAbi(NationStrengthContract.abi)
    },
    NavyContract : {
      address: NavyContract.address as Address,
      abi: fixAbi(NavyContract.abi)
    },
    NavyContract2 : {
      address: NavyContract2.address as Address,
      abi: fixAbi(NavyContract2.abi)
    },
    AdditionalNavyContract : {
      address: AdditionalNavyContract.address as Address,
      abi: fixAbi(AdditionalNavyContract.abi)
    },
    NavalActionsContract : {  
      address: NavalActionsContract.address as Address,
      abi: fixAbi(NavalActionsContract.abi)
    },
    NavalBlockadeContract : {
      address: NavalBlockadeContract.address as Address,
      abi: fixAbi(NavalBlockadeContract.abi)
    },
    BreakBlockadeContract : {
      address: BreakBlockadeContract.address as Address,
      abi: fixAbi(BreakBlockadeContract.abi)
    },
    NavalAttackContract : {
      address: NavalAttackContract.address as Address,
      abi: fixAbi(NavalAttackContract.abi)
    },
    NukeContract : {
      address: NukeContract.address as Address,
      abi: fixAbi(NukeContract.abi)
    },
    ResourcesContract : {
      address: ResourcesContract.address as Address,
      abi: fixAbi(ResourcesContract.abi)
    },
    BonusResourcesContract : {
      address: BonusResourcesContract.address as Address,
      abi: fixAbi(BonusResourcesContract.abi)
    },
    SenateContract : {
      address: SenateContract.address as Address,
      abi: fixAbi(SenateContract.abi)
    },
    SpyContract : {
      address: SpyContract.address as Address,
      abi: fixAbi(SpyContract.abi)
    },
    SpyOperationsContract : {
      address: SpyOperationsContract.address as Address,
      abi: fixAbi(SpyOperationsContract.abi)
    },
    TaxesContract : {
      address: TaxesContract.address as Address,
      abi: fixAbi(TaxesContract.abi)
    },
    AdditionalTaxesContract : {
      address: AdditionalTaxesContract.address as Address,
      abi: fixAbi(AdditionalTaxesContract.abi)
    },
    TechnologyMarketContract : {
      address: TechnologyMarketContract.address as Address,
      abi: fixAbi(TechnologyMarketContract.abi)
    },
    TreasuryContract : {
      address: TreasuryContract.address as Address,
      abi: fixAbi(TreasuryContract.abi)
    },
    WarContract : {
      address: WarContract.address as Address,
      abi: fixAbi(WarContract.abi)
    },
    WondersContract1 : {
      address: WondersContract1.address as Address,
      abi: fixAbi(WondersContract1.abi)
    },
    WondersContract2 : {
      address: WondersContract2.address as Address,
      abi: fixAbi(WondersContract2.abi)
    },
    WondersContract3  : {
      address: WondersContract3.address as Address,
      abi: fixAbi(WondersContract3.abi)
    },
    WondersContract4 : {
      address: WondersContract4.address as Address,
      abi: fixAbi(WondersContract4.abi)
    },    
    Messenger : {
      address: Messenger.address as Address,
      abi: fixAbi(Messenger.abi)
    },
    AllianceManager: {
      address: AllianceManager.address as Address,
      abi: fixAbi(AllianceManager.abi)
    }
  }
};

export default externalContracts;
