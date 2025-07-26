"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ApolloProvider } from "@apollo/client";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";

const baseChain = {
  id: 8453,
  name: "Base",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.base.org"],
    },
    public: {
      http: ["https://mainnet.base.org"],
    },
  },
  blockExplorers: {
    default: { name: "Basescan", url: "https://basescan.org" },
  },
};
import { wagmiConfig } from "~~/utils/wagmiConfig";
import { client as apolloClient } from "~~/lib/apolloClient";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "@coinbase/onchainkit/styles.css";

const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          chain={baseChain}
          apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY!}
          rpcUrl="https://mainnet.base.org"
        >
          <RainbowKitProvider>
            <ApolloProvider client={apolloClient}>
              <ThemeProvider enableSystem>
                <ScaffoldEthAppWithProviders>
                  {children}
                </ScaffoldEthAppWithProviders>
              </ThemeProvider>
            </ApolloProvider>
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}