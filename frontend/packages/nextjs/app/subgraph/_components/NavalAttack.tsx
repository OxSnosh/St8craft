import { GetNavalAttacksDocument, execute } from "~~/.graphclient";

const NavalAttackTable = async () => {
  const { data, errors } = await execute(GetNavalAttacksDocument, {});
  const navalAttacks = data?.navalAttacks ?? [];

  if (errors) {
    return <div className="text-red-500 text-center mt-5">Failed to load naval battles.</div>;
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
            {navalAttacks.map((navalAttack: any) => (
              <tr key={navalAttack.battleId}>
                <th>{navalAttack.battleId}</th>
                <td>{navalAttack.attackerLosses}</td>
                <td>{navalAttack.defenderLosses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NavalAttackTable;
