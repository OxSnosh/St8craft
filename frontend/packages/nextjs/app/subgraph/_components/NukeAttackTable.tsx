import { GetNukeAttacksDocument, execute } from "~~/.graphclient";

const NukeAttackTable = async () => {
  const { data, errors } = await execute(GetNukeAttacksDocument, {});
  const nukeAttacks = data?.nukeAttacks ?? [];

  if (errors) {
    return <div className="text-red-500 text-center mt-5">Failed to load nuke attacks.</div>;
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
            </tr>
          </thead>
          <tbody>
            {nukeAttacks.map((nukeAttack: any) => (
              <tr key={nukeAttack.attackId}>
                <th>{nukeAttack.warId}</th>
                <td>{nukeAttack.attackerId}</td>
                <td>{nukeAttack.defenderId}</td>
                <td>{nukeAttack.landed.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NukeAttackTable;
