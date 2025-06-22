import Nation from "./_components/Nation";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "St8craft",
  description: "Build your own nation with St8craft",
});

const Debug: NextPage = () => {
  return (
    <>
      <Nation />
    </>
  );
};

export default Debug;
