import { GetCruiseMissileAttacksDocument, execute } from "~~/.graphclient";

export default async function CruiseMissileAttackTable() {
  let cruiseMissileAttacks = [];

  try {
    const { data } = await execute(GetCruiseMissileAttacksDocument, {});
    cruiseMissileAttacks = data?.cruiseMissileAttacks ?? [];
    console.log("Cruise Missile Attacks:", cruiseMissileAttacks);
  } catch (err) {
    console.error("Failed to fetch cruise missile attack data:", err);
    return <div className="text-red-500 text-center mt-5">Failed to load cruise missile attacks.</div>;
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="table bg-base-100 table-zebra">
          <thead>
            <tr className="rounded-xl">
              <th className="bg-primary">War ID</th>
              <th className="bg-primary">Attacker ID</th>
              <th className="bg-primary">Defender ID</th>
              <th className="bg-primary">Landed</th>
              <th className="bg-primary">Damage</th>
            </tr>
          </thead>
          <tbody>
            {cruiseMissileAttacks.map((attack: any) => (
              <tr key={attack.attackId}>
                <td>{attack.warId}</td>
                <td>{attack.attackerId}</td>
                <td>{attack.defenderId}</td>
                <td>{attack.landed.toString()}</td>
                <td>
                  {attack.damageTypeNumber === "0"
                    ? "tanks"
                    : attack.damageTypeNumber === "1"
                      ? "tech"
                      : attack.damageTypeNumber === "2"
                        ? "infrastructure"
                        : "Unknown"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
