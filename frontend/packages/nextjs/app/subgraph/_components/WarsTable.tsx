import { GetWarsDocument, execute } from "~~/.graphclient";

const WarsTable = async () => {
  let wars: any[] = [];

  try {
    const { data } = await execute(GetWarsDocument, {});
    wars = data?.wars || [];
  } catch (err) {
    return <div className="text-red-500">Error loading wars</div>;
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="table bg-base-100 table-zebra">
          <thead>
            <tr className="rounded-xl">
              <th className="bg-primary">War ID</th>
              <th className="bg-primary">Offense</th>
              <th className="bg-primary">Defense</th>
            </tr>
          </thead>
          <tbody>
            {wars.map((war: any) => (
              <tr key={war.warId}>
                <th>{war.warId}</th>
                <td>{war.offenseId}</td>
                <td>{war.defenseId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarsTable;
