import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import * as users from "./src/data/users.js";
import * as apartments from "./src/data/apartments.js";
import { typeDefs } from "./src/controllers/typeDefs.js";
import { resolvers } from "./src/controllers/resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 3000, host: "0.0.0.0" },
  cors: {
    origin: "http://ec2-52-15-86-109.us-east-2.compute.amazonaws.com", // Update with your client's URL
    credentials: true, // Set to true if your client needs to send credentials (cookies, etc.)
  },
});
console.log(`🚀  Server ready at: ${url}`);
