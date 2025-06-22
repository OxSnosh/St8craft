import { GetBlockadesDocument, execute } from "~~/.graphclient";

export default async function BlockadeTable() {
  let blockades = [];

  try {
    const { data } = await execute(GetBlockadesDocument, {});
    blockades = data?.blockades ?? [];
    console.log("Blockades:", blockades);
  } catch (err) {
    console.error("Failed to fetch blockades:", err);
    return <div className="text-red-500 text-center mt-5">Failed to load blockades.</div>;
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="table bg-base-100 table-zebra">
          <thead>
            <tr className="rounded-xl">
              <th className="bg-primary">Battle ID</th>
              <th className="bg-primary">Blockader ID</th>
              <th className="bg-primary">Blockaded ID</th>
              <th className="bg-primary">Percentage Reduction</th>
            </tr>
          </thead>
          <tbody>
            {blockades.map((blockade: any) => (
              <tr key={blockade.battleId}>
                <td>{blockade.battleId}</td>
                <td>{blockade.blockaderId}</td>
                <td>{blockade.blockadedId}</td>
                <td>{blockade.percentageReduction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
