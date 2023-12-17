import { GraphQLError } from "graphql";
import * as reviews from "../data/reviews.js";
import * as users from "../data/users.js";
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
      let exists = await client.exists("renters");
      if (exists) {
        console.log("renters in cache");
        try {
          let allRenters = await client.get("renters");
          return JSON.parse(allRenters);
        } catch (e) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      } else {
        try {
          const renters = await users.getAllRenters();
          if (!renters) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
          await client.set("renters", JSON.stringify(renters));
          await client.expire("renters", 3600);
          return renters;
        } catch (e) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      }
    },
    // Fetch all landlords
    landlords: async () => {
      let exists = await client.exists("landlords");
      if (exists) {
        console.log("landlords in cache");
        try {
          let allLandlords = await client.get("landlords");
          return JSON.parse(allLandlords);
        } catch (e) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      } else {
        try {
          const landlords = await users.getAllLandlords();
          if (!landlords) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
          await client.set("landlords", JSON.stringify(landlords));
          await client.expire("renters", 3600);
          return landlords;
        } catch (e) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      }
    },
    // Fetch a single renter by ID
    getRenterById: async (_, args) => {
      let id = args._id.trim();
      let exists = await client.exists(`renter.${id}`);
      if (exists) {
        console.log("renter in cache");
        try {
          let detailRenter = await client.get(`renter.${id}`);
          return JSON.parse(detailRenter);
        } catch (e) {
          throw new GraphQLError(e, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      } else {
        console.log("renter not in cache");
        try {
          const renter = await users.getUserById(id);
          if (!renter) {
            throw new GraphQLError("Renter Not Found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          await client.set(`renter.${id}`, JSON.stringify(renter));
        } catch (e) {
          throw new GraphQLError(e, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return renter;
      }
    },
    // Fetch a single landlord by ID
    getLandlordsById: async (_, args) => {
      let id = args._id.trim();
      let exists = await client.exists(`landlord.${id}`);
      if (exists) {
        console.log("landlord in cache");
        try {
          let detailLandlord = await client.get(`landlord.${id}`);
          return JSON.parse(detailLandlord);
        } catch (e) {
          throw new GraphQLError(e, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      } else {
        console.log("landlord not in cache");
        try {
          const landlord = await users.getUserById(id);
          if (!landlord) {
            throw new GraphQLError("Land lord Not Found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          await client.set(`landlord.${id}`, JSON.stringify(landlord));
        } catch (e) {
          throw new GraphQLError(e, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return landlord;
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
