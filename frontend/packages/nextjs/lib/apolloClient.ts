import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/115215/st-8-craft/0.0.2",
  cache: new InMemoryCache(),
});
