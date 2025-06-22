import { createConfig, http } from "wagmi";
import { baseSepolia, localhost, sepolia } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [localhost, sepolia, baseSepolia],
  transports: {
    [localhost.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http(),
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
  ssr: true,
});
