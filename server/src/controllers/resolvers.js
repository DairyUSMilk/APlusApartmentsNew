import { GraphQLError } from "graphql";
import * as reviews from "../data/reviews.js";
import * as users from "../data/users.js";
import * as apartments from "../data/apartments.js";

import redis from "redis";
import flat from "flat";
import validation from "../utils/helpers.js";

const unflatten = flat.unflatten;
const client = redis.createClient({
  url: process.env.REDIS || "redis://redis:6379",
});

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

          const renterFields = renters.map((renter) => {
            return reviewFormat(renter);
          });

          await client.set("renters", JSON.stringify(renterFields));
          await client.expire("renters", 3600);
          return renterFields;
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

          const landlordFields = landlords.map((landlord) => {
            return reviewFormat(landlord);
          });

          await client.set("landlords", JSON.stringify(landlordFields));
          await client.expire("renters", 3600);
          return landlordFields;
        } catch (e) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      }
    },
    // Fetch a single renter by ID
    getRenterById: async (_, args) => {
      let id = args.id.trim();
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
          const renterFields = renterFormat(renter);

          await client.set(`renter.${id}`, JSON.stringify(renterFields));
          return renterFields;
        } catch (e) {
          throw new GraphQLError(e, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      }
    },
    // Fetch a single landlord by ID
    getLandlordById: async (_, args) => {
      let id = args.id.trim();
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

          const landlordFields = landlordFormat(landlord);

          await client.set(`landlord.${id}`, JSON.stringify(landlordFields));
          return landlordFields;
        } catch (e) {
          throw new GraphQLError(e, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      }
    },
    getAdminById: async (_, args) => {
      let id = args.id.trim();
      let exists = await client.exists(`admin.${id}`);
      if (exists) {
        console.log("admin in cache");
        try {
          let detailAdmin = await client.get(`admin.${id}`);
          return JSON.parse(detailAdmin);
        } catch (e) {
          throw new GraphQLError(e, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      } else {
        console.log("admin not in cache");
        try {
          const admin = await users.getUserById(id);
          if (!admin) {
            throw new GraphQLError("Admin Not Found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          const adminFields = adminFormat(admin);

          await client.set(`admin.${id}`, JSON.stringify(adminFields));
          return adminFields;
        } catch (e) {
          throw new GraphQLError(e, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      }
    },
    apartments: async (_, args) => {
      let hasFilter = false;

      if (args.city) {
        args.city = validation.checkString(args.city, "city");
        hasFilter = true;
      }

      if (args.state) {
        args.state = validation.checkState(args.state, "state");
        hasFilter = true;
      }

      if (args.minPrice) {
        args.minPrice = validation.checkNumber(args.minPrice, "min price");
        hasFilter = true;
      }

      if (args.maxPrice) {
        if (args.minPrice && args.maxPrice <= args.minPrice) {
          throw new GraphQLError(`Max filter price must be greater than min`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        args.maxPrice = validation.checkNumber(args.maxPrice, "max price");
        hasFilter = true;
      }

      if (args.rating) {
        if (args.rating < 1 || args.rating > 5) {
          throw new GraphQLError(
            `Please specify a minimum rating between 1 and 5`,
            {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            }
          );
        }
        args.rating = validation.checkNumber(args.rating, "rating");
        hasFilter = true;
      }

      if (!hasFilter) {
        // get all approved apartments without filering
        let exists = await client.exists("apartments");
        if (exists) {
          console.log("apartments in cache");
          try {
            let allApartments = await client.get("apartments");
            return JSON.parse(allApartments);
          } catch (e) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
        } else {
          try {
            const allApartments = await apartments.getAllApprovedApartments();
            if (!allApartments) {
              throw new GraphQLError(`Internal Server Error`, {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
              });
            }

            const formattedApartments = allApartments.map((apartment) => {
              return apartmentFormat(apartment);
            });

            await client.set("apartments", JSON.stringify(formattedApartments));
            await client.expire("apartments", 3600);
            return formattedApartments;
          } catch (e) {
            throw new GraphQLError(e, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
        }
      }
      try {
        // use some combination of filters to query Apartments collection in db
        const allApartments = await apartments.getApprovedApartmentsByFilter(
          args.city,
          args.state,
          args.minPrice,
          args.maxPrice,
          args.rating
        );
        if (!allApartments) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }

        const formattedApartments = allApartments.map((apartment) => {
          return apartmentFormat(apartment);
        });

        // do not cache in redis here since there are too many combinations of filters
        // when you edit or add a new apartment you would need to reset all stored combos of filters in cache
        return formattedApartments;
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    pendingApartments: async () => {
      let exists = await client.exists("pendingApartments");
      if (exists) {
        console.log("pending apartments in cache");
        try {
          let pendingApartments = await client.get("pendingApartments");
          return JSON.parse(pendingApartments);
        } catch (e) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      } else {
        try {
          const pendingApartments =
            await apartments.getAllApartmentsPendingApproval();
          if (!pendingApartments) {
            return [];
          }

          const formattedApartments = pendingApartments.map((apartment) => {
            return apartmentFormat(apartment);
          });

          await client.set(
            "pendingApartments",
            JSON.stringify(formattedApartments)
          );
          await client.expire("pendingApartments", 3600);
          return formattedApartments;
        } catch (e) {
          throw new GraphQLError(e, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      }
    },
    getApartmentById: async (_, args) => {
      let id = args.id.trim();
      let exists = await client.exists(`apartment.${id}`);
      if (exists) {
        console.log("apartment in cache");
        try {
          let detailApartment = await client.get(`apartment.${id}`);
          return JSON.parse(detailApartment);
        } catch (e) {
          throw new GraphQLError(e, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      } else {
        console.log("apartment not in cache");
        try {
          const apartment = await apartments.getApartmentById(id);
          if (!apartment) {
            throw new GraphQLError("Apartment Not Found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          const formattedApartment = apartmentFormat(apartment);

          await client.set(
            `apartment.${id}`,
            JSON.stringify(formattedApartment)
          );
          return formattedApartment;
        } catch (e) {
          throw new GraphQLError(e, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      }
    },
    getUserAccountType: async (_, args) => {
      const retievedUser = await users.getUserById(args.id);
      return retievedUser.accountType;
    },
    reviews: async (_, args) => {
      let posterId = validation.checkString(args.posterId);
      let exists = await client.exists(`reviews.${posterId}`);
      if (exists) {
        console.log(`reviews for user ${posterId} in cache`);
        try {
          let reviews = await client.get(`reviews.${posterId}`);
          return JSON.parse(reviews);
        } catch (e) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      }
      let allReviews;
      try {
        allReviews = await reviews.getAllReviewsByPosterId(posterId);
        if (!allReviews) {
          return [];
        }
        const reviewFields = allReviews.map((review) => {
          return reviewFormat(review);
        });
        await client.set(`reviews.${posterId}`, JSON.stringify(reviewFields));
        return reviewFields;
      } catch (e) {
        throw new GraphQLError(`Internal Server Error`);
      }
    },
    pendingReviews: async () => {
      let exists = await client.exists("pendingReviews");
      if (exists) {
        console.log(`pending reviews in cache`);
        try {
          let reviews = await client.get("pendingReviews");
          return JSON.parse(reviews);
        } catch (e) {
          throw new GraphQLError(`Internal Server Error`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      }
      let pendingReviews;
      try {
        pendingReviews = await reviews.getAllReviewsPendingApproval();
        if (!pendingReviews) {
          return [];
        }
        const reviewFields = pendingReviews.map((review) => {
          return reviewFormat(review);
        });

        await client.set(`pendingReviews`, JSON.stringify(reviewFields));

        return reviewFields;
      } catch (e) {
        throw new GraphQLError(`Internal Server Error`);
      }
    },
  },
  Renter: {
    savedApartments: async (parentValue) => {
      const bookmarkedApartments = await apartments.getUserBookmarkedApartments(
        parentValue.id
      );
      return bookmarkedApartments.map((apartment) => {
        return apartmentFormat(apartment);
      });
    },
  },
  Landlord: {
    savedApartments: async (parentValue) => {
      const bookmarkedApartments = await apartments.getUserBookmarkedApartments(
        parentValue.id
      );
      return bookmarkedApartments.map((apartment) => {
        return apartmentFormat(apartment);
      });
    },
    ownedApartments: async (parentValue) => {
      const ownedApartments = await apartments.getApartmentsByLandlordId(
        parentValue.id
      );
      return ownedApartments.map((apartment) => {
        return apartmentFormat(apartment);
      });
    },
  },
  Admin: {
    savedApartments: async (parentValue) => {
      const bookmarkedApartments = await apartments.getUserBookmarkedApartments(
        parentValue.id
      );
      return bookmarkedApartments.map((apartment) => {
        return apartmentFormat(apartment);
      });
    },
  },
  Apartment: {
    landlord: async (parentValue) => {
      const apartment = await apartments.getApartmentById(parentValue.id);
      const landlord = await users.getUserById(apartment.landlord);
      return landlordFormat(landlord);
    },
    reviews: async (parentValue) => {
      const apartmentReviews = await reviews.getAllReviewsByApartmentId(
        parentValue.id
      );
      return apartmentReviews.map((review) => {
        return reviewFormat(review);
      });
    },
  },
  Mutation: {
    addRenter: async (_, args) => {
      try {
        const newUser = await users.createUser(
          args.id,
          args.name,
          args.email,
          args.city,
          args.state,
          args.dateOfBirth,
          args.gender,
          "renter"
        );
        await client.set(`renter.${newUser._id}`);
        return renterFormat(newUser);
      } catch (e) {
        throw new GraphQLError(`Internal Server Error`);
      }
    },
    addLandlord: async (_, args) => {
      try {
        const newUser = await users.createUser(
          args.id,
          args.name,
          args.email,
          args.city,
          args.state,
          args.dateOfBirth,
          args.gender,
          "landlord"
        );
        await client.set(`landlord.${newUser._id}`);
        return landlordFormat(newUser);
      } catch (e) {
        throw new GraphQLError(e.message);
      }
    },
    addAdmin: async (_, args) => {
      try {
        const newUser = await users.createUser(
          args.id,
          args.name,
          args.email,
          args.city,
          args.state,
          args.dateOfBirth,
          args.gender,
          "admin"
        );
        await client.set(`admin.${newUser._id}`);
        return adminFormat(newUser);
      } catch (e) {
        throw new GraphQLError(`Internal Server Error`);
      }
    },
    editRenter: async (_, args) => {
      let editedRenter;
      let renterId = validation.checkString(args.id);
      try {
        const renter = await users.getUserById(renterId);
        if (renter) {
          if (args.name) {
            renter.name = validation.checkName(args.name, "name");
          }
          if (args.email) {
            renter.email = validation.checkString(args.email, "email");
          }
          if (args.gender) {
            renter.gender = validation.checkString(args.gender, "gender");
          }
          if (args.city) {
            renter.city = args.city;
          }
          if (args.state) {
            renter.state = args.state;
          }
          if (args.dateOfBirth) {
            renter.dateOfBirth = args.dateOfBirth;
          }
          editedRenter = await users.updateUserInfoById(
            renterId,
            renter.name,
            renter.email,
            renter.gender,
            renter.city,
            renter.state,
            renter.dateOfBirth
          );
        } else
          throw new GraphQLError(
            `Can't find renter with an Id of ${renterId}`,
            {
              extensions: { code: "NOT_FOUND" },
            }
          );
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      try {
        await client.del(`renter.${renterId}`);
        await client.del("renters");
        return renterFormat(editedRenter);
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    editLandlord: async(_, args) => {
        let editedLandlord;
        let landlordId = validation.checkString(args.id);
        console.log(JSON.stringify(args));
        try{
            const landlord = await users.getUserById(landlordId);
            if(landlord){
                if(args.name){
                    landlord.name = validation.checkName(args.name, "name");
                }
                if(args.contactInfo){
                    landlord.contactInfo = validation.checkEmail(args.contactInfo, "contactInfo");
                }
                if(args.gender){
                    landlord.gender = validation.checkString(args.gender, "gender");
                }
                if(args.city){
                    landlord.city = args.city;
                }
                if(args.state){
                    landlord.state = args.state;
                }
                if(args.dateOfBirth){
                    landlord.dateOfBirth = args.dateOfBirth;
                }
                editedLandlord = await users.updateUserInfoById(
                    landlordId,
                    landlord.name,
                    landlord.contactInfo,
                    landlord.gender,
                    landlord.city,
                    landlord.state,
                    landlord.dateOfBirth
                );
            } 
            else{
                throw new GraphQLError(`Can't find landlord with id: ${landlordId}`, {
                    extensions: { code: "NOT_FOUND" },
                  }
                );
            }
        } catch(e){
            throw new GraphQLError(e, {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
              });
        }

        try{
            await client.del(`landlord.${landlordId}`);
            await client.del("landlords");
            return landlordFormat(editedLandlord);
        } catch (e) {
            throw new GraphQLError(e, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
    },
    removeRenter: async (_, args) => {
      let renterId;
      try {
        renterId = validation.checkString(args.id, "remove renterId");
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      let removedRenter;
      try {
        removedRenter = await users.deleteUserById(renterId);
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      try {
        await client.del(`renter.${renterId}`);
        await client.del("renters");
        return renterFormat(removedRenter);
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    addApartment: async (_, args) => {
      let apartment = {};
      try {
        apartment.name = validation.checkName(args.name, "apartment name");
        apartment.description = validation.checkString(
          args.description,
          "apartment description"
        );
        apartment.address = validation.checkString(
          args.address,
          "apartment address"
        );
        apartment.city = validation.checkString(args.city, "apartment city");
        apartment.state = validation.checkState(args.state, "apartment state");
        apartment.dateListed = new Date().toLocaleDateString();
        apartment.amenities = args.amenities;
        // apartment.images = args.images; /*** SKIP FOR NOW ***/
        apartment.price = args.price;
        apartment.landlordId = args.landlordId;
        apartment.rating = args.rating;
        apartment.isApproved = false;
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      try {
        let landlord = await users.getUserById(apartment.landlordId);
        if (!landlord) throw "can't find";
      } catch (e) {
        throw new GraphQLError(
          `Could not find landlord with an Id of ${apartment.landlordId}`,
          {
            extensions: { code: "NOT_FOUND" },
          }
        );
      }
      try {
        let newApartment = await apartments.createApartment(
          apartment.name,
          apartment.description,
          apartment.address,
          apartment.city,
          apartment.state,
          apartment.dateListed,
          apartment.amenities,
          // apartment.images /*** SKIP FOR NOW ***/
          apartment.price,
          apartment.landlordId
        );
        const formatApartment = apartmentFormat(newApartment);
        await client.set(
          `apartment.${newApartment._id}`,
          JSON.stringify(formatApartment)
        );
        await client.del("pendingApartments");
        return formatApartment;
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    editApartment: async (_, args) => {
      //not supposed to change dateListed, rating and isApproved
      let editedApartment;
      try {
        let id = validation.checkString(args.id);
        const apartment = await apartments.getApartmentById(id);
        if (apartment) {
          if (args.name) {
            apartment.name = validation.checkName(args.name, "name");
          }
          if (args.address) {
            apartment.address = validation.checkString(
              args.address,
              "apartment address"
            );
          }
          if (args.city) {
            apartment.city = validation.checkString(
              args.city,
              "apartment city"
            );
          }
          if (args.state) {
            apartment.state = validation.checkState(
              args.state,
              "apartment state"
            );
          }
          if (args.description) {
            apartment.description = validation.checkString(
              args.description,
              "apartment description"
            );
          }
          if (args.images) {
            apartment.images = validation.checkStringArray(
              args.images,
              "apartment images"
            );
          }
          if (args.price) {
            apartment.pricePerMonth = validation.checkPrice(
              args.price,
              "apartment price"
            );
          }
          if (args.amenities) {
            apartment.amenities = validation.checkStringArray(
              args.amenities,
              "apartment amenities"
            );
          }
          if (args.landlordId) {
            apartment.landlord = validation.checkString(
              args.landlordId,
              "apartment landlordId"
            );
          }
          editedApartment = await apartments.updateApartmentInfoById(
            id,
            apartment.name,
            apartment.description,
            apartment.address,
            apartment.city,
            apartment.state,
            apartment.dateListed,
            apartment.amenities,
            apartment.images,
            apartment.pricePerMonth,
            apartment.landlord,
            apartment.rating,
            apartment.isApproved
          );
        } else
          throw new GraphQLError(`Can't find apartment with an Id of ${id}`, {
            extensions: { code: "NOT_FOUND" },
          });
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      try {
        await client.del(`apartment.${id}`);
        await client.del("apartment");
        return apartmentFormat(editedApartment);
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    removeApartment: async (_, args) => {
      let id = validation.checkId(args.id, "apartment id");
      let removedApartment;
      try {
        removedApartment = await apartments.deleteApartmentById(id);
      } catch (e) {
        new GraphQLError(`Could not delete apartment with id of ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      try {
        await client.del(`apartment.${id}`);
        if (removedApartment.isApproved) {
          await client.del(`apartments`);
        } else {
          await client.del(`pendingApartments`);
        }

        return apartmentFormat(removedApartment);
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    approveApartment: async (_, args) => {
      let id = validation.checkId(args.id, "apartment id");
      let approvedApartment;
      try {
        approvedApartment = await apartments.approveApartmentById(id);
      } catch (e) {
        new GraphQLError(`Could not approve apartment with id of ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      try {
        await client.del(`apartment.${id}`);
        await client.del(`apartments`);
        await client.del(`pendingApartments`);

        return apartmentFormat(approvedApartment);
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    approveReview: async (_, args) => {
      let id = validation.checkId(args.id, "review id");
      let approvedReview;
      try {
        approvedReview = await reviews.approveReviewById(id);
      } catch (e) {
        new GraphQLError(`Could not approve apartment with id of ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      try {
        await client.del(`review.${id}`);
        await client.del(`reviews`);
        await client.del(`pendingReviews`);

        return reviewFormat(approvedReview);
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    createReview: async (_, args) => {
      let posterId = validation.checkString(args.posterId, "posterId");
      let apartmentId = validation.checkId(args.apartmentId, "apartmentId");
      let rating = validation.checkRating(args.rating, "rating");
      let content = validation.checkString(args.content, "content");
      let datePosted = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      let addedReview;
      try {
        addedReview = await reviews.createReview(
          posterId,
          apartmentId,
          rating,
          content,
          datePosted
        );
      } catch (e) {
        new GraphQLError(
          `Could not add a review for apartment ${apartmentId} from user ${posterId}`,
          {
            extensions: { code: "NOT_FOUND" },
          }
        );
      }
      const formattedReview = reviewFormat(addedReview);
      try {
        await client.set(
          `review.${addedReview._id}`,
          JSON.stringify(formattedReview)
        );
        await client.del("pendingReviews");
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      return formattedReview;
    },
    deleteReview: async (_, args) => {
      let id = validation.checkId(args.id, "delete review id");
      let deletedReview;
      try {
        deletedReview = await reviews.deleteReviewById(id);
      } catch (e) {
        new GraphQLError(`Could not delete the review ${id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      try {
        if (deletedReview.isApproved) {
          await client.del(`reviews.${deletedReview.posterId}`);
        } else {
          await client.del(`pendingReviews`);
        }
        await client.del(`review.${id}`);
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      return reviewFormat(deletedReview);
    },
    addBookmark: async (_, args) => {
      let userId = validation.checkString(args.userId, "user id");
      let apartmentId = validation.checkId(args.apartmentId, "apartment id");
      let userWithNewBookmark;
      try {
        userWithNewBookmark = await users.addApartmentToBookmark(
          userId,
          apartmentId
        );
      } catch (e) {
        new GraphQLError(
          `Could not bookmark apartment with id of ${apartmentId} for user ${userId}`,
          {
            extensions: { code: "NOT_FOUND" },
          }
        );
      }
      try {
        await client.del(
          `${userWithNewBookmark.accountType}.${userWithNewBookmark}`
        );
        await client.del(`apartments`);
        await client.del(`pendingApartments`);

        return userId;
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    removeBookmark: async (_, args) => {
      let userId = validation.checkString(args.userId, "user id");
      let apartmentId = validation.checkId(args.apartmentId, "apartment id");
      let userWithRemovedBookmark;
      try {
        userWithRemovedBookmark = await users.removeApartmentFromBookmark(
          userId,
          apartmentId
        );
      } catch (e) {
        new GraphQLError(
          `Could not remove bookmark for apartment with id of ${apartmentId} for user ${userId}`,
          {
            extensions: { code: "NOT_FOUND" },
          }
        );
      }
      try {
        await client.del(
          `${userWithRemovedBookmark.accountType}.${userWithRemovedBookmark}`
        );
        await client.del(`apartments`);
        await client.del(`pendingApartments`);

        return userId;
      } catch (e) {
        throw new GraphQLError(e, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
};

function renterFormat(renter) {
  return {
    id: renter._id,
    name: renter.name,
    dateOfBirth: renter.dateOfBirth,
    gender: renter.gender,
  };
}

function landlordFormat(landlord) {
  return {
    id: landlord._id,
    name: landlord.name,
    contactInfo: landlord.email,
  };
}

function adminFormat(admin) {
  return {
    id: admin._id,
    name: admin.name,
  };
}

function apartmentFormat(apartment) {
  return {
    id: apartment._id,
    name: apartment.name,
    address: `${apartment.address}, ${apartment.city}, ${apartment.state}`,
    description: apartment.description,
    // images: apartment.images, /*** SKIP FOR NOW ***/
    price: apartment.pricePerMonth,
    amenities: apartment.amenities,
  };
}

function reviewFormat(review) {
  return {
    id: review._id,
    posterId: review.posterId,
    apartmentId: review.apartmentId,
    datePosted: review.datePosted,
    content: review.content,
    rating: review.rating,
  };
}
