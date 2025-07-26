"use client";

import React, { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import {
  Swap,
  SwapAmountInput,
  SwapToggleButton,
  SwapButton,
  SwapMessage,
  SwapToast,
} from "@coinbase/onchainkit/swap";
import type { Token } from "@coinbase/onchainkit/token";

type Props = {
  /** WBX ERC-20 address on Base mainnet */
  wbxAddress: `0x${string}`;
  /** Show best-price routing via 0x Aggregator (default false = Uniswap v3 router) */
  useAggregator?: boolean;
};

const ETH: Token = {
  name: "ETH",
  symbol: "ETH",
  address: "", // native token
  decimals: 18,
  chainId: 8453,
  image:
    "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
};

const USDC: Token = {
  name: "USD Coin",
  symbol: "USDC",
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  decimals: 6,
  chainId: 8453,
  image:
    "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/usdc.png",
};

export default function WBXSwap({ wbxAddress, useAggregator = false }: Props) {
  const WBX: Token = {
    name: "WarBucks",
    symbol: "WBX",
    address: wbxAddress,
    decimals: 18,
    chainId: 8453,
    image: "/wbx.png",
  };

  const tokens = [ETH, USDC, WBX];

  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [wbxBalance, setWbxBalance] = useState<bigint>(0n);

  useEffect(() => {
    if (!address || !publicClient) return;
    (async () => {
      try {
        const bal = (await publicClient.readContract({
          address: wbxAddress,
          abi: [
            {
              constant: true,
              inputs: [{ name: "account", type: "address" }],
              name: "balanceOf",
              outputs: [{ name: "", type: "uint256" }],
              stateMutability: "view",
              type: "function",
            },
          ],
          functionName: "balanceOf",
          args: [address],
        })) as bigint;
        setWbxBalance(bal);
      } catch {
        // ignore balance errors
      }
    })();
  }, [address, publicClient, wbxAddress]);

  return (
    <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
      <h2 className="text-2xl font-bold text-primary-content text-center mb-2">
        Swap ETH / USDC ↔ WBX
      </h2>

      <p className="text-center text-sm mb-4">
        Wallet WBX balance: {(Number(wbxBalance) / 1e18).toLocaleString()}
      </p>

      <Swap
        // Default router = Uniswap v3. Flip this on for 0x Aggregator best pricing.
        experimental={useAggregator ? { useAggregator: true } : undefined}
        // Optional: gas sponsorship if you configure a Paymaster in OnchainKitProvider
        // isSponsored
        // Optional: tweak slippage
        // config={{ maxSlippage: 3 }}
      >
        <SwapAmountInput
          label="Sell"
          type="from"
          token={ETH}
          swappableTokens={tokens}
        />
        <SwapToggleButton />
        <SwapAmountInput
          label="Buy"
          type="to"
          token={WBX}
          swappableTokens={tokens}
        />
        <SwapButton />
        <SwapMessage />
        <SwapToast />
      </Swap>

      <div className="mt-4 text-xs opacity-70 text-center">
        Swaps execute on Base. Connect your wallet to proceed.
      </div>
    </div>
  );
}