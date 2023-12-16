import { GraphQLError } from "graphql";
import * as reviews from "../data/reviews.js";
import { users as userCollection } from "../configs/mongoCollections.js";
import redis from "redis";
import flat from "flat";
import validation from "./helper.js";
import { v4 as uuid } from "uuid";
const unflatten = flat.unflatten;
const client = redis.createClient();
client.connect().then(() => {});
export const resolvers = {
  Query: {
    // Fetch all renters
    renters: async () => {
      const users = await userCollection();
      const renters = await users.find({ accountType: "Renter" }).toArray();
      if (!renters) {
        throw new GraphQLError(`Internal Server Error`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      return renters;
    },
    // Fetch all landlords
    landlords: async () => {
      const users = await userCollection();
      const landlords = await users.find({ accountType: "Landlord" }).toArray();
      if (!landlords) {
        throw new GraphQLError(`Internal Server Error`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      return landlords;
    },
    // Fetch a single renter by ID
    getRenterById: async (_, args) => {
      const users = await userCollection();
      const renter = await users.findOne({
        _id: args._id,
        accountType: "Renter",
      });
      if (!renter) {
        throw new GraphQLError("Renter Not Found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return;
    },
    // Fetch a single landlord by ID
    getLandlordsById: async (_, args) => {
      const users = await userCollection();
      const landlord = await users.findOne({
        _id: args._id,
        accountType: "Landlord",
      });
      if (!landlord) {
        throw new GraphQLError("Landlord Not Found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
    },
    reviews: async (_, args) => {
      let allReviews;
      try {
        allReviews = await reviews.getAllReviewsByPosterId(args.posterId);
        if (!allReviews)
          throw new GraphQLError("Review Not Found", {
            extensions: { code: "NOT_FOUND" },
          });
      } catch (e) {
        throw new GraphQLError(`Internal Server Error`);
      }
      return allReviews;
    },
  },
};
