import Link from "next/link";
import { GetNationsDocument, execute } from "~~/.graphclient";
import { Address } from "~~/components/scaffold-eth";

const NationsTable = async () => {
  const { data, errors } = await execute(GetNationsDocument, {});
  const nations = data?.nations ?? [];

  return (
    <div className="font-special flex justify-center items-center">
      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="table bg-base-100 table-zebra">
          <thead>
            <tr className="rounded-xl">
              <th className="bg-primary">Nation ID</th>
              <th className="bg-primary">Owner</th>
              <th className="bg-primary">Nation Name</th>
              <th className="bg-primary">Ruler</th>
            </tr>
          </thead>
          <tbody>
            {nations.slice(0, 5).map((nation: any) => (
              <tr key={nation.nationId} className="cursor-pointer group transition duration-200">
                <th className="group-hover:bg-gray-400">
                  <Link href={`/nations?id=${nation.nationId}`} className="block w-full h-full" prefetch={false}>
                    {nation.nationId}
                  </Link>
                </th>
                <td className="group-hover:bg-gray-400">
                  <Address address={nation.owner} />
                </td>
                <td className="group-hover:bg-gray-400">{nation.name}</td>
                <td className="group-hover:bg-gray-400">{nation.ruler}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NationsTable;
