"use client";

import React from "react";
import backgroundImage from "/public/landing_page_2.webp";

const LandingPage = () => {
  return (
    <div
      className="w-screen h-screen bg-cover bg-center text-white relative"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* FIXED Instructions Bar */}
      <div className="fixed inset-x-0 top-24 z-[9999] px-4">
        <div className="mx-auto max-w-4xl rounded-lg border border-white/20 bg-black/70 backdrop-blur-sm px-4 py-3 text-sm md:text-base text-center">
          <span className="font-semibold">Instructions:</span>{" "}
          1) Connect Wallet&nbsp;&nbsp; 2) Mint Nation&nbsp;&nbsp; 3){" "}
          <a
            href="/buy"
            className="underline underline-offset-4 hover:no-underline"
          >
            Buy WarBucks Here
          </a>
          &nbsp;&nbsp; 4) Conquer
        </div>
      </div>

      {/* Foreground content (pad for fixed bar) */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start px-4 pt-40">
        <div className="w-3/4 max-w-xl bg-black/70 p-6 rounded-lg text-center">
          <h1 className="text-4xl font-bold mb-4">WELCOME COMMANDER</h1>
          <p className="text-lg mb-6">
            THE FATE OF YOUR NATION IS IN YOUR HANDS
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;