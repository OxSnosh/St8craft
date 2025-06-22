import { GetSpyOperationsDocument, execute } from "~~/.graphclient";

const SpyOperationsTable = async () => {
  let spyOperations: any[] = [];

  try {
    const { data } = await execute(GetSpyOperationsDocument, {});
    spyOperations = data?.spyOperations || [];
  } catch (err) {
    return <div className="text-red-500">Error loading spy operations</div>;
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="table bg-base-100 table-zebra">
          <thead>
            <tr className="rounded-xl">
              <th className="bg-primary">Attacker ID</th>
              <th className="bg-primary">Defender ID</th>
              <th className="bg-primary">Success</th>
              <th className="bg-primary">Attack Type</th>
            </tr>
          </thead>
          <tbody>
            {spyOperations.map((spyAttack: any) => (
              <tr key={spyAttack.id}>
                <td>{spyAttack.attackerId}</td>
                <td>{spyAttack.defenderId}</td>
                <td>{spyAttack.success ? "Success" : "Thwarted"}</td>
                <td>{spyAttack.attackType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpyOperationsTable;
