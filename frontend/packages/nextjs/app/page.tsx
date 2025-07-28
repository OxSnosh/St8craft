"use client";

import { useEffect, useState } from "react";
import { VT323 } from "next/font/google";
import Link from "next/link";
import NationsTable from "./subgraph/_components/NationsTable";
import type { NextPage } from "next";
import { useAccount } from "wagmi";

const vt323 = VT323({ weight: "400", subsets: ["latin"] });

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  useEffect(() => {
    const audio = new Audio("/homepage_audio.mp4");
    audio.play().catch(error => console.error("Audio playback failed:", error));
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const fullText = "Welcome Commander\nThe fate of your nation is in your hands";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const interval = setInterval(() => {
        setDisplayText(fullText.slice(0, index + 1));
        setIndex(index + 1);
      }, 60);
      return () => clearInterval(interval);
    }
  }, [index, fullText]);

  return (
    <>
      {/* Centered Background Wrapper with Fixed Size and Aligned to Top */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-[4300px] h-[1500px] bg-black overflow-hidden">
        <div
          className="relative w-full h-full bg-no-repeat bg-contain bg-top"
          style={{ backgroundImage: "url('/background_expanded.jpg')" }}
        >
          {/* ===== Instructions Bar ===== */}
          <div className="absolute top-[150px] left-1/2 -translate-x-1/2 w-full px-4 z-20">
            <div
              className={`mx-auto max-w-[700px] rounded-lg border border-white/20 bg-black/70 backdrop-blur-sm px-5 py-3 text-center text-white ${vt323.className}`}
            >
              <span className="text-xl">Instructions:</span>{" "}
              <span className="text-lg">
                1) Connect Wallet&nbsp;&nbsp; 2){" "}
                <Link href="/mint" className="underline underline-offset-4 hover:no-underline">
                  Mint Nation
                </Link>
                &nbsp;&nbsp; 3){" "}
                <Link href="/buy" className="underline underline-offset-4 hover:no-underline">
                  Buy WarBucks Here
                </Link>
                &nbsp;&nbsp; 4) Conquer
              </span>
            </div>
          </div>

          {/* Fixed overlay text box */}
          <div
            className={`absolute top-[318px] left-1/2 transform -translate-x-1/2 w-[330px] h-[200px] bg-opacity-70 bg-black p-6 rounded-lg flex flex-col justify-center items-center z-10 ${vt323.className}`}
          >
            <h1 className="text-center text-green-600 whitespace-pre-line text-2xl">
              {displayText}
            </h1>
          </div>

          {/* Recently Minted */}
          <div className="absolute top-[593px] left-1/2 transform -translate-x-1/2 w-full flex justify-center z-10">
            <div className="w-[600px] bg-black bg-opacity-70 p-6 rounded-lg flex flex-col items-center">
              <h1 className="text-center text-white text-xl">Recently Minted Nations</h1>
              <NationsTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;