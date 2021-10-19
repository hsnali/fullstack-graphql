import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";

/**
 * Create a new apollo client and export as default
 */
const link = new HttpLink({ uri: "https://rickandmortyapi.com/graphql" });
const cache = new InMemoryCache();
const client = new ApolloClient({
  link,
  cache,
});

export default client;
