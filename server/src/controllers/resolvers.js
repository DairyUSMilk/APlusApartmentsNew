import { GraphQLError } from "graphql";
import * as reviews from "../data/reviews.js";
import * as user from "../data/users.js";
import { users as userCollection } from "../configs/mongoCollection.js";
export const resolvers = {
  Query: {
    // Fetch all renters
    renters: async () => {
      const users = await userCollection();
      const renters = await users.find({ accountType: "renter" }).toArray();
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
      const landlords = await users.find({ accountType: "landlord" }).toArray();
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
        uid: args.uid,
        accountType: "renter",
      });
      if (!renter) {
        throw new GraphQLError("Renter Not Found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return renter;
    },
    // Fetch a single landlord by ID
    getLandlordById: async (_, args) => {
      const users = await userCollection();
      const landlord = await users.findOne({
        _id: args._id,
        accountType: "landlord",
      });
      if (!landlord) {
        throw new GraphQLError("Landlord Not Found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
    },
    getUserAccountType: async (_, args) => {
      const retievedUser = await user.getUserById(args.uid);
      return retievedUser.accountType;
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
  Mutation: {
    addRenter: async(_, args) => {
      try {
        const newUser = await user.createUser(
          args.uid,
          args.name,
          args.email,
          args.city,
          args.state,
          args.dateOfBirth,
          args.gender,
          'renter'
        );
        return {
          uid: newUser.uid,
          name: newUser.name,
          dateOfBirth: newUser.dateOfBirth,
          gender: newUser.gender,
          savedApartments: newUser.bookmarkedApartments
        };
      } catch (e) {
        throw new GraphQLError(e.message);
      }
    },
    addLandlord: async(_, args) => {
      try {
        const newUser = await user.createUser(
          args.uid,
          args.name,
          args.email,
          args.city,
          args.state,
          args.dateOfBirth,
          args.gender,
          'landlord'
        );
        return {
          _id: newUser.uid,
          name: newUser.name,
          contactInfo: newUser.email,
          ownedApartments: newUser.savedApartments
        };
      } catch (e) {
        throw new GraphQLError(`Internal Server Error`);
      }
    }
  }
};
