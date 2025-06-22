import { GetBreakBlockadesDocument, execute } from "~~/.graphclient";

export default async function BreakBlockadeTable() {
  let breakBlockades = [];

  try {
    const { data } = await execute(GetBreakBlockadesDocument, {});
    breakBlockades = data?.breakBlockades ?? [];
    console.log("BreakBlockades:", breakBlockades);
  } catch (err) {
    console.error("Failed to fetch break blockades:", err);
    return <div className="text-red-500 text-center mt-5">Failed to load break blockade data.</div>;
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="table bg-base-100 table-zebra">
          <thead>
            <tr className="rounded-xl">
              <th className="bg-primary">Battle ID</th>
              <th className="bg-primary">Attacker Losses</th>
              <th className="bg-primary">Defender Losses</th>
            </tr>
          </thead>
          <tbody>
            {breakBlockades.map((breakBlockade: any) => (
              <tr key={breakBlockade.battleId}>
                <td>{breakBlockade.battleId}</td>
                <td>{breakBlockade.attackerLosses}</td>
                <td>{breakBlockade.defenderLosses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
