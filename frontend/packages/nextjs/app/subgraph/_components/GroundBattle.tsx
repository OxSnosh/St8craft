import { GetGroundBattlesDocument, execute } from "~~/.graphclient";

export default async function GroundBattleTable() {
  let groundBattles = [];

  try {
    const { data } = await execute(GetGroundBattlesDocument, {});
    groundBattles = data?.groundBattles ?? [];
    console.log("Ground Battles:", groundBattles);
  } catch (err) {
    console.error("Failed to fetch ground battles:", err);
    return <div className="text-red-500 text-center mt-5">Failed to load ground battle data.</div>;
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="table bg-base-100 table-zebra">
          <thead>
            <tr className="rounded-xl">
              <th className="bg-primary">War ID</th>
              <th className="bg-primary">Attacker ID</th>
              <th className="bg-primary">Attacker Soldier Losses</th>
              <th className="bg-primary">Attacker Tank Losses</th>
              <th className="bg-primary">Defender ID</th>
              <th className="bg-primary">Defender Soldier Losses</th>
              <th className="bg-primary">Defender Tank Losses</th>
            </tr>
          </thead>
          <tbody>
            {groundBattles.map((battle: any) => (
              <tr key={battle.groundBattleId}>
                <td>{battle.warId}</td>
                <td>{battle.attackerId}</td>
                <td>{battle.attackerSoldierLosses}</td>
                <td>{battle.attackerTankLosses}</td>
                <td>{battle.defenderId}</td>
                <td>{battle.defenderSoldierLosses}</td>
                <td>{battle.defenderTankLosses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
