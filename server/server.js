import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import * as users from "./src/data/users.js";
import { typeDefs } from "./src/controllers/typeDefs.js";
import { resolvers } from "./src/controllers/resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 3000 },
});
console.log(`🚀  Server ready at: ${url}`);
