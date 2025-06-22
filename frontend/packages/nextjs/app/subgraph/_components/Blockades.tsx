"use client";

import { useEffect, useState } from "react";
import { GetBlockadesDocument, execute } from "~~/.graphclient";

const BlockadeTable = () => {
  const [blockadeData, setBlockadeData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!execute || !GetBlockadesDocument) {
        return;
      }
      try {
        const { data: result } = await execute(GetBlockadesDocument, {});
        console.log(result.blockades);
        console.log("Blockade", result);
        setBlockadeData(result);
      } catch (err) {
        setError(err);
      } finally {
      }
    };

    fetchData();
  }, []);

  if (error) {
    return null;
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
            {blockadeData?.blockades?.map((blockade: any, index: number) => (
                <tr key={blockade.battleId}>
                <th>{blockade.battleId}</th>
                <th>{blockade.blockaderId}</th>
                <th>{blockade.blockadedId}</th>
                <th>{blockade.percentageReduction}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlockadeTable;