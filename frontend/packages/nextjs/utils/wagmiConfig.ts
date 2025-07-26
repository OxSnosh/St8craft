import { createConfig, http } from "wagmi";
import { base, baseSepolia, sepolia, localhost } from "viem/chains";

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia, sepolia, localhost],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
    [baseSepolia.id]: http("https://sepolia.base.org"),
    [sepolia.id]: http(), // or your RPC
    [localhost.id]: http("http://127.0.0.1:8545"),
  },
  ssr: true,
});