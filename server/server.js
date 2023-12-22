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
const port = process.env.PORT || 3000;
const { url } = await startStandaloneServer(server, {
  listen: { port: port },
  cors: {
    origin: "http://localhost:5173",
    credentials: true, // Allows setting of cookies
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
  },
});
console.log(`🚀  Server ready at: ${url}`);
