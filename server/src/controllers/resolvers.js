import { GraphQLError } from "graphql";
import * as reviews from "../data/reviews.js";
import { users as userCollection } from "../configs/mongoCollections.js";

export const resolvers = {
  Query: {
    // Fetch all renters
    renters: async () => {},
    // Fetch all landlords
    landlords: async () => {},
    // Fetch a single renter by ID
    getRenterById: async (_, { _id }) => {},
    // Fetch a single landlord by ID
    getLandlordsById: async (_, { _id }) => {},
  },
  // Other type resolvers like Renter, Landlord, Apartment, Group could go here if needed
  // ...
  Mutation: {
    createUser: async (_, args) => {
      
    }
  }
};
