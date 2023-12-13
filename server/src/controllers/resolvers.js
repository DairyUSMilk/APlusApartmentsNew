import { GraphQLError } from "graphql";
import * as reviews from "../data/reviews.js";
export const resolvers = {
  Query: {
    // Fetch all renters
    renters: async (_, args) => {},
    // Fetch all landlords
    landlords: async () => {},
    // Fetch a single renter by ID
    getRenterById: async (_, { _id }) => {},
    // Fetch a single landlord by ID
    getLandlordsById: async (_, { _id }) => {},
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
