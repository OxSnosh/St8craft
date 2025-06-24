import React, { use, useEffect, useState } from "react";
import { NationSearchBar } from "../../../components/NationSearch";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
// import { ContractInterface as ABI, ethers, providers, utils } from "ethers";
// import { AbiCoder } from "ethers/lib/utils";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { useSignMessage } from "wagmi";
import { blockade, groundAttack } from "~~/utils/attacks";
import {
  getAh1CobraCount,
  getAh64ApacheCount,
  getB1bLancerCount,
  getB2SpiritCount,
  getB17gFlyingFortressCount,
  getB52MitchellCount,
  getB52StratofortressCount,
  getBristolBlenheimCount,
  getTupolevTu160Count,
} from "~~/utils/bombers";
import { tokensOfOwner } from "~~/utils/countryMinter";
import { getCruiseMissileCount } from "~~/utils/cruiseMissiles";
import {
  getF15EagleCount,
  getF22RaptorCount,
  getF35LightningCount,
  getF86SabreCount,
  getF100SuperSabreCount,
  getMig15Count,
  getP51MustangCount,
  getSu30MkiCount,
  getYak9Count,
} from "~~/utils/fighters";
import { getDefendingSoldierCount, getDefendingTankCount } from "~~/utils/forces";
import { getNukeCount } from "~~/utils/missiles";
import {
  getAircraftCarrierCount,
  getBattleshipCount,
  getCorvetteCount,
  getCruiserCount,
  getDestroyerCount,
  getFrigateCount,
  getLandingShipCount,
  getSubmarineCount,
} from "~~/utils/navy";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { getSpyCount } from "~~/utils/spies";
import { getNationStrength } from "~~/utils/strength";
import { getTechnologyCount } from "~~/utils/technology";
import { checkBalance } from "~~/utils/treasury";
import { declareWar, nationActiveWars } from "~~/utils/wars";
import { returnWarDetails } from "~~/utils/wars";
import { deployForcesToWar, isWarActive, offerPeace } from "~~/utils/wars";

interface Nation {
  id: string;
  name: string;
}

interface NationComparisonTableProps {
  mintedNations: Nation[];
  handleNationChange: (nationId: string) => void;
  selectedNationForces: Record<string, any> | null;
  defendingNationForces: Record<string, any> | null;
  setDefendingNationDetails: (nationId: string) => void;
}

const NationComparisonTable: React.FC<NationComparisonTableProps> = ({
  mintedNations,
  handleNationChange,
  selectedNationForces,
  defendingNationForces,
  setDefendingNationDetails,
}) => {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <select onChange={e => handleNationChange(e.target.value)}>
          <option value="">Attacking Nation</option>
          {mintedNations.map(nation => (
            <option key={nation.id} value={nation.id}>
              {nation.name}
            </option>
          ))}
        </select>

        <div>Labels</div>

        <select onChange={e => setDefendingNationDetails(e.target.value)}>
          <option value="">Select Target Nation</option>
          {mintedNations.map(nation => (
            <option key={nation.id} value={nation.id}>
              {nation.name}
            </option>
          ))}
        </select>
      </div>

      <table border={1} cellPadding={10} style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Nation Details</th>
            <th>Labels</th>
            <th>Target Nation Details</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: "Strength", key: "strength" },
            { label: "Balance", key: "balance" },
            { label: "Technology", key: "technology" },
            { label: "Defending Soldiers", key: "defendingSoldiers" },
            { label: "Defending Tanks", key: "defendingTanks" },
            { label: "Yak9", key: "yak9" },
            { label: "P51 Mustang", key: "p51Mustang" },
            { label: "F86 Sabre", key: "f86Sabre" },
            { label: "Mig15", key: "mig15" },
            { label: "F100 Super Sabre", key: "f100SuperSabre" },
            { label: "F35 Lightning", key: "f35Lightning" },
            { label: "F15 Eagle", key: "f15Eagle" },
            { label: "Su30 Mki", key: "su30Mki" },
            { label: "F22 Raptor", key: "f22Raptor" },
            { label: "Ah1 Cobra", key: "ah1Cobra" },
            { label: "Ah64 Apache", key: "ah64Apache" },
            { label: "Bristol Blenheim", key: "bristolBlenheim" },
            { label: "B52 Mitchell", key: "b52Mitchell" },
            { label: "B17g Flying Fortress", key: "b17gFlyingFortress" },
            { label: "B52 Stratofortress", key: "b52Stratofortress" },
            { label: "B2 Spirit", key: "b2Spirit" },
            { label: "B1b Lancer", key: "b1bLancer" },
            { label: "Tupolev Tu160", key: "tupolevTu160" },
            { label: "Corvette", key: "corvette" },
            { label: "Landing Ship", key: "landingShip" },
            { label: "Battleship", key: "battleship" },
            { label: "Cruiser", key: "cruiser" },
            { label: "Frigate", key: "frigate" },
            { label: "Destroyer", key: "destroyer" },
            { label: "Submarine", key: "submarine" },
            { label: "Aircraft Carrier", key: "aircraftCarrier" },
            { label: "Cruise Missiles", key: "cruiseMissiles" },
            { label: "Spies", key: "spies" },
            { label: "Nukes", key: "nukes" },
          ].map(item => (
            <tr key={item.key}>
              <td>{selectedNationForces ? selectedNationForces[item.key] : "-"}</td>
              <td>{item.label}</td>
              <td>{defendingNationForces ? defendingNationForces[item.key] : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DeclareWar = () => {
  const publicClient = usePublicClient();
  const { address: walletAddress } = useAccount();
  const contractsData = useAllContracts();

  const [mintedNations, setMintedNations] = useState<Nation[]>([]);
  const [selectedNation, setSelectedNation] = useState<string>("");
  const [defendingNation, setDefendingNation] = useState<string>("");
  const [selectedNationDetails, setSelectedNationDetails] = useState<Record<string, any> | null>(null);
  const [defendingNationDetails, setDefendingNationDetails] = useState<Record<string, any> | null>(null);

  // const publicClient = usePublicClient();
  // const { address: walletAddress } = useAccount();
  // const contractsData = useAllContracts();
  const { writeContractAsync } = useWriteContract();
  // const {signMessageAsync} = useSignMessage();

  // const [mintedNations, setMintedNations] = useState<Nation[]>([]);
  // const [selectedNationForces, setSelectedNationForces] = useState<Record<string, any>>({});
  // const [selectedNationId, setSelectedNationId] = useState<string>("");
  // const [defendingNationForces, setDefendingNationForces] = useState<Record<string, any>>({});
  // const [defendingNationId, setDefendingNationId] = useState<string>("");
  const [activeWars, setActiveWars] = useState<string[]>([]);
  // const [warDetails, setWarDetails] = useState<Record<string, any>>({});
  // const [selectedWar, setSelectedWar] = useState<string>("");
  // const [soldiersToDeploy, setSoldiersToDeploy] = useState<number>(0);
  // const [tanksToDeploy, setTanksToDeploy] = useState<number>(0);
  // const [attackType, setAttackType] = useState<number>(0);
  // const [spyAttackType, setSpyAttackType] = useState<number>(0);

  useEffect(() => {
    const fetchMintedNations = async () => {
      if (walletAddress && contractsData?.CountryMinter && publicClient) {
        const ownedNations = await tokensOfOwner(walletAddress, publicClient, contractsData.CountryMinter);
        setMintedNations(ownedNations.map((id: string) => ({ id, name: `Nation ${id}` })));
      }
    };
    fetchMintedNations();
  }, [walletAddress, contractsData, publicClient]);

  const fetchNationDetails = async (nationId: string) => {
    if (!nationId || !publicClient || !contractsData) return null;

    try {
      const [
        nationStrength,
        nationBalanceRaw,
        technologyCount,
        defendingSoldiers,
        defendingTanks,
        yak9,
        p51Mustang,
        f86Sabre,
        mig15,
        f100SuperSabre,
        f35Lightning,
        f15Eagle,
        su30Mki,
        f22Raptor,
        ah1Cobra,
        ah64Apache,
        bristolBlenheim,
        b52Mitchell,
        b17gFlyingFortress,
        b52Stratofortress,
        b2Spirit,
        b1bLancer,
        tupolevTu160,
        corvette,
        landingShip,
        battleship,
        cruiser,
        frigate,
        destroyer,
        submarine,
        aircraftCarrier,
        cruiseMissiles,
        spies,
        nukes,
      ] = await Promise.all([
        getNationStrength(nationId, publicClient, contractsData.NationStrengthContract),
        checkBalance(nationId, publicClient, contractsData.TreasuryContract),
        getTechnologyCount(nationId, publicClient, contractsData.InfrastructureContract),
        getDefendingSoldierCount(nationId, publicClient, contractsData.ForcesContract),
        getDefendingTankCount(nationId, publicClient, contractsData.ForcesContract),
        getYak9Count(nationId, publicClient, contractsData.FightersContract),
        getP51MustangCount(nationId, publicClient, contractsData.FightersContract),
        getF86SabreCount(nationId, publicClient, contractsData.FightersContract),
        getMig15Count(nationId, publicClient, contractsData.FightersContract),
        getF100SuperSabreCount(nationId, publicClient, contractsData.FightersContract),
        getF35LightningCount(nationId, publicClient, contractsData.FightersContract),
        getF15EagleCount(nationId, publicClient, contractsData.FightersContract),
        getSu30MkiCount(nationId, publicClient, contractsData.FightersContract),
        getF22RaptorCount(nationId, publicClient, contractsData.FightersContract),
        getAh1CobraCount(nationId, publicClient, contractsData.BombersContract),
        getAh64ApacheCount(nationId, publicClient, contractsData.BombersContract),
        getBristolBlenheimCount(nationId, publicClient, contractsData.BombersContract),
        getB52MitchellCount(nationId, publicClient, contractsData.BombersContract),
        getB17gFlyingFortressCount(nationId, publicClient, contractsData.BombersContract),
        getB52StratofortressCount(nationId, publicClient, contractsData.BombersContract),
        getB2SpiritCount(nationId, publicClient, contractsData.BombersContract),
        getB1bLancerCount(nationId, publicClient, contractsData.BombersContract),
        getTupolevTu160Count(nationId, publicClient, contractsData.BombersContract),
        getCorvetteCount(nationId, publicClient, contractsData.NavyContract),
        getLandingShipCount(nationId, publicClient, contractsData.NavyContract),
        getBattleshipCount(nationId, publicClient, contractsData.NavyContract),
        getCruiserCount(nationId, publicClient, contractsData.NavyContract),
        getFrigateCount(nationId, publicClient, contractsData.NavyContract2),
        getDestroyerCount(nationId, publicClient, contractsData.NavyContract2),
        getSubmarineCount(nationId, publicClient, contractsData.NavyContract2),
        getAircraftCarrierCount(nationId, publicClient, contractsData.NavyContract2),
        getCruiseMissileCount(nationId, publicClient, contractsData.MissilesContract),
        getSpyCount(nationId, publicClient, contractsData.SpyContract),
        getNukeCount(nationId, publicClient, contractsData.MissilesContract),
      ]);

      return {
        strength: nationStrength.toString(),
        balance: Math.floor(Number(nationBalanceRaw) / 10 ** 18).toString(), // Convert balance from Wei to whole units
        technology: technologyCount.toString(),
        defendingSoldiers: defendingSoldiers.toString(),
        defendingTanks: defendingTanks.toString(),
        yak9: yak9.toString(),
        p51Mustang: p51Mustang.toString(),
        f86Sabre: f86Sabre.toString(),
        mig15: mig15.toString(),
        f100SuperSabre: f100SuperSabre.toString(),
        f35Lightning: f35Lightning.toString(),
        f15Eagle: f15Eagle.toString(),
        su30Mki: su30Mki.toString(),
        f22Raptor: f22Raptor.toString(),
        ah1Cobra: ah1Cobra.toString(),
        ah64Apache: ah64Apache.toString(),
        bristolBlenheim: bristolBlenheim.toString(),
        b52Mitchell: b52Mitchell.toString(),
        b17gFlyingFortress: b17gFlyingFortress.toString(),
        b52Stratofortress: b52Stratofortress.toString(),
        b2Spirit: b2Spirit.toString(),
        b1bLancer: b1bLancer.toString(),
        tupolevTu160: tupolevTu160.toString(),
        corvette: corvette.toString(),
        landingShip: landingShip.toString(),
        battleship: battleship.toString(),
        cruiser: cruiser.toString(),
        frigate: frigate.toString(),
        destroyer: destroyer.toString(),
        submarine: submarine.toString(),
        aircraftCarrier: aircraftCarrier.toString(),
        cruiseMissiles: cruiseMissiles.toString(),
        spies: spies.toString(),
        nukes: nukes.toString(),
      };
    } catch (error) {
      console.error(`Error fetching nation details for Nation ${nationId}:`, error);
      return null;
    }
  };

  const handleNationChange = async (nationId: string) => {
    setSelectedNation(nationId); // Update selected nation first
    const details = await fetchNationDetails(nationId); // Fetch details
    console.log(details);
    setSelectedNationDetails(details); // Ensure state updates
  };

  const handleDefendingNationChange = async (nationId: string) => {
    setDefendingNation(nationId); // Update selected nation first
    const details = await fetchNationDetails(nationId); // Fetch details
    setDefendingNationDetails(details); // Ensure state updates
  };

  function parseRevertReason(error: any): string {
    if (error?.data) {
      try {
        if (error.data.startsWith("0x08c379a0")) {
          console.log("Revert reason data:", error.data);   
        }
      } catch (decodeError) {
        return "Unknown revert reason";
      }
    }
    return error?.message || "Transaction failed";
  }

  const handleDeclareWar = async () => {
    if (!selectedNation || !defendingNation) {
      alert("Please select both an attacking and defending nation.");
      return;
    }

    const { writeContractAsync } = useWriteContract();
    const publicClient = usePublicClient();
    const contractData = contractsData.WarContract;

    // Ensure contract data, ABI, and publicClient are available
    if (!contractData.address || !contractData.abi || !publicClient) {
      console.error("Contract address, ABI, or publicClient is missing");
      return;
    }

    try {
      // Simulate the transaction (readContract) using Wagmi's publicClient
      const data = await publicClient.readContract({
        abi: contractData.abi,
        address: contractData.address,
        functionName: "declareWar",
        args: [selectedNation, defendingNation],
      });

      // Simulate the transaction call
      const result = await publicClient.call({
        to: contractData.address,
        data: data as `0x${string}`,
      });

      console.log("Transaction Simulation Result:", result);

      // Check for revert reason in the result
      if (String(result).startsWith("0x08c379a0")) {
        const errorMessage = parseRevertReason({ data: result });
        alert(`Transaction failed: ${errorMessage}`);
        return;
      }

      // Send the transaction using Wagmi's writeContractAsync
      const tx = await writeContractAsync({
        address: contractData.address,
        abi: contractData.abi,
        functionName: "declareWar",
        args: [selectedNation, defendingNation],
      });

      console.log("Transaction Sent:", tx);

      // Show success message after the transaction
      alert(`War declared between Nation ${selectedNation} and Nation ${defendingNation}`);
    } catch (error: any) {
      const errorMessage = parseRevertReason(error);
      console.error("Error declaring war:", errorMessage);
      alert(`Failed to declare war: ${errorMessage}`);
    }
  };

  return (
    <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
      <h2 className="text-2xl font-bold text-primary-content text-center mb-4">Declare War</h2>

      {/* Declare War Button */}
      {selectedNation && defendingNation && (
        <button onClick={handleDeclareWar} className="btn btn-error w-full text-lg mt-2">
          Declare War
        </button>
      )}

      {/* Nation Selection Dropdowns */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {/* Attacking Nation */}
        <div className="p-4 bg-base-200 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-primary">Attacking Nation</h3>
          <select
            onChange={e => handleNationChange(e.target.value)}
            value={selectedNation}
            className="select select-bordered w-full bg-base-100 text-base-content mt-2"
          >
            <option value="">Select Attacking Nation</option>
            {mintedNations.map(nation => (
              <option key={nation.id} value={nation.id}>
                {nation.name}
              </option>
            ))}
          </select>
        </div>

        {/* Label Section */}
        <div className="flex justify-center items-center text-lg font-semibold text-secondary-content">
          Nation Attributes
        </div>

        {/* Defending Nation */}
        <div className="p-4 bg-base-200 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-primary">Target Nation</h3>
          <div className="mt-2">
            <NationSearchBar
              placeholder="Search and select a target nation"
              onSelect={nation => handleDefendingNationChange(nation?.nationId || "")}
            />
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md">
          <thead className="bg-primary text-primary-content">
            <tr>
              <th className="p-3">Attacking Nation</th>
              <th className="p-3">Labels</th>
              <th className="p-3">Defending Nation</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Strength", key: "strength" },
              { label: "Balance", key: "balance" },
              { label: "Technology", key: "technology" },
              { label: "Defending Soldiers", key: "defendingSoldiers" },
              { label: "Defending Tanks", key: "defendingTanks" },
              { label: "Yak9", key: "yak9" },
              { label: "P51 Mustang", key: "p51Mustang" },
              { label: "F86 Sabre", key: "f86Sabre" },
              { label: "Mig15", key: "mig15" },
              { label: "F100 Super Sabre", key: "f100SuperSabre" },
              { label: "F35 Lightning", key: "f35Lightning" },
              { label: "F15 Eagle", key: "f15Eagle" },
              { label: "Su30 Mki", key: "su30Mki" },
              { label: "F22 Raptor", key: "f22Raptor" },
              { label: "Ah1 Cobra", key: "ah1Cobra" },
              { label: "Ah64 Apache", key: "ah64Apache" },
              { label: "Bristol Blenheim", key: "bristolBlenheim" },
              { label: "B52 Mitchell", key: "b52Mitchell" },
              { label: "B17g Flying Fortress", key: "b17gFlyingFortress" },
              { label: "B52 Stratofortress", key: "b52Stratofortress" },
              { label: "B2 Spirit", key: "b2Spirit" },
              { label: "B1b Lancer", key: "b1bLancer" },
              { label: "Tupolev Tu160", key: "tupolevTu160" },
              { label: "Corvette", key: "corvette" },
              { label: "Landing Ship", key: "landingShip" },
              { label: "Battleship", key: "battleship" },
              { label: "Cruiser", key: "cruiser" },
              { label: "Frigate", key: "frigate" },
              { label: "Destroyer", key: "destroyer" },
              { label: "Submarine", key: "submarine" },
              { label: "Aircraft Carrier", key: "aircraftCarrier" },
              { label: "Cruise Missiles", key: "cruiseMissiles" },
              { label: "Spies", key: "spies" },
              { label: "Nukes", key: "nukes" },
            ].map(item => (
              <tr key={item.key} className="border-b border-neutral">
                <td className="p-3 text-center">{selectedNationDetails ? selectedNationDetails[item.key] : "-"}</td>
                <td className="p-3 font-semibold text-primary-content text-center">{item.label}</td>
                <td className="p-3 text-center">{defendingNationDetails ? defendingNationDetails[item.key] : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeclareWar;
