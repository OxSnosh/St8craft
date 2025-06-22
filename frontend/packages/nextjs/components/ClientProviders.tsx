"use client";

import { ApolloProvider } from "@apollo/client";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { client as apolloClient } from "~~/lib/apolloClient";
import { wagmiConfig } from "~~/utils/wagmiConfig";

// Create a client
const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>
          <ApolloProvider client={apolloClient}>
            <ThemeProvider enableSystem={true}>
              <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
            </ThemeProvider>
          </ApolloProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
