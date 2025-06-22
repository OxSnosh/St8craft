import { GetAirBattlesDocument, execute } from "~~/.graphclient";

export default async function AirBattleTable() {
  let airBattles = [];

  try {
    const { data } = await execute(GetAirBattlesDocument, {});
    airBattles = data?.airBattles ?? [];
  } catch (err) {
    console.error("Failed to fetch air battles:", err);
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="table bg-base-100 table-zebra">
          <thead>
            <tr className="rounded-xl">
              <th className="bg-primary">Battle ID</th>
              <th className="bg-primary">Attacker ID</th>
              <th className="bg-primary">Defender ID</th>
              <th className="bg-primary">Attacker Fighter Losses</th>
              <th className="bg-primary">Attacker Bomber Losses</th>
              <th className="bg-primary">Defender Fighter Losses</th>
              <th className="bg-primary">Infrastructure Damage</th>
              <th className="bg-primary">Tank Damage</th>
              <th className="bg-primary">Cruise Missile Damage</th>
            </tr>
          </thead>
          <tbody>
            {airBattles.map((battle: any) => (
              <tr key={battle.battleId}>
                <td>{battle.battleId}</td>
                <td>{battle.attackerId}</td>
                <td>{battle.defenderId}</td>
                <td>{battle.attackerFighterLosses}</td>
                <td>{battle.attackerBomberLosses}</td>
                <td>{battle.defenderFighterLosses}</td>
                <td>{battle.infrastructureDamage}</td>
                <td>{battle.tankDamage}</td>
                <td>{battle.cruiseMissileDamage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
