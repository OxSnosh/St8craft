import Nation from "./_components/Nation";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import { Suspense } from "react";

export const metadata = getMetadata({
  title: "St8craft",
  description: "Build your own nation with St8craft",
});

const Debug: NextPage = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Nation />
      </Suspense>
    </>
  );
};

export default Debug;
