import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://gateway.thegraph.com/api/bc94fce129c4d2c8714d45afac9ba23a/subgraphs/id/cHssgqLpdhAvNBBdiq1w1dGbYWAhmggPpcpCoXNEpWJ",
  cache: new InMemoryCache(),
});
