import { ObjectId } from "mongodb";
import { apartments } from "./../configs/mongoCollection.js";
import * as reviewFunctions from "./reviews.js";
import * as users from "./users.js";

import helpers from "./../utils/helpers.js";

export const createApartment = async (
  name,
  description,
  address,
  city,
  state,
  dateListed,
  amenities,
  pricePerMonth,
  landlord
) => {
  name = helpers.checkString(name, "name");
  description = helpers.checkString(description, "description");
  address = helpers.checkString(address, "address");
  city = helpers.checkString(city, "city");
  state = helpers.checkState(state, "state");
  dateListed = helpers.checkString(dateListed, "dateListed");
  amenities = helpers.checkStringArray(amenities, "amenities");
  //images = helpers.checkStringArray(images, "images"); /****SKIP FOR NOW *** */
  pricePerMonth = helpers.checkNumber(pricePerMonth, "pricePerMonth");
  landlord = helpers.checkString(landlord, "landlord");
  const apartment = {
    name: name,
    description: description,
    address: address,
    city: city,
    state: state,
    dateListed: dateListed,
    amenities: amenities,
    //images: images,
    pricePerMonth: pricePerMonth,
    landlord: landlord,
    rating: 0.0,
    isApproved: false,
  };
  const apartmentCollection = await apartments();
  const output = await apartmentCollection.insertOne(apartment);
  if (!output.acknowledged || !output.insertedId) {
    throw `Apartment named ${name} was not inserted into database`;
  }

  return await getApartmentById(output.insertedId.toString());
};

export const getApartmentById = async (id) => {
  id = helpers.checkId(id);
  const apartmentCollection = await apartments();
  const apartment = await apartmentCollection.findOne(getIdFilter(id));
  if (!apartment) {
    throw `No apartment exists with id ${id}`;
  }
  return formatApartmentObject(apartment);
};

export const getAllApartments = async () => {
  const apartmentCollection = await apartments();
  const apartmentList = await apartmentCollection.find({}).toArray();
  for (let i = 0; i < apartmentList.length; i++) {
    formatApartmentObject(apartmentList[i]);
  }
  return apartmentList;
};

export const deleteApartmentById = async (id) => {
  id = helpers.checkId(id);
  const apartmentCollection = await apartments();
  const apartment = await getApartmentById(id);
  const result = await apartmentCollection.deleteOne(getIdFilter(id));
  if (result.deletedCount !== 1) {
    throw `No apartment exists with id ${id}`;
  }
  return apartment;
};

export const updateApartmentRatingById = async (id) => {
  id = helpers.checkId(id, "apartment id");
  const apartmentCollection = await apartments();
  const reviews = await reviewFunctions.getAllReviewsByApartmentId(id);
  let sum = 0.0;
  for (let i = 0; i < reviews.length; i++) {
    sum += reviews[i].rating;
  }
  const average = sum / reviews.length;
  const updateInfo = { $set: { rating: average } };
  const result = await apartmentCollection.updateOne(
    getIdFilter(id),
    updateInfo
  );
  if (result.matchedCount !== 1) {
    throw `No apartment exists with id ${id}`;
  }
  return await getApartmentById(id);
};

export const approveApartmentById = async (id) => {
  id = helpers.checkId(id, "apartment id");
  const apartmentCollection = await apartments();
  const updateInfo = { $set: { isApproved: true } };
  const result = await apartmentCollection.updateOne(
    getIdFilter(id),
    updateInfo
  );
  if (result.modifiedCount !== 1) {
    throw `No apartment exists with id ${id}`;
  }
  return await getApartmentById(id);
};

export const getApartmentsByLandlordId = async (id) => {
  id = helpers.checkString(id, "landlord id");

  const apartmentCollection = await apartments();
  const landlordApartments = await apartmentCollection
    .find({ landlord: id, isApproved: true })
    .toArray();
  for (let i = 0; i < landlordApartments.length; i++) {
    formatApartmentObject(landlordApartments[i]);
  }
  return landlordApartments;
};

export const getAllApartmentsPendingApproval = async () => {
  const apartmentCollection = await apartments();
  const pendingApartments = await apartmentCollection
    .find({ isApproved: false })
    .toArray();
  for (let i = 0; i < pendingApartments.length; i++) {
    formatApartmentObject(pendingApartments[i]);
  }
  return pendingApartments;
};

export const getAllApprovedApartments = async () => {
  const apartmentCollection = await apartments();
  const approvedApartments = await apartmentCollection
    .find({ isApproved: true })
    .toArray();
  for (let i = 0; i < approvedApartments.length; i++) {
    formatApartmentObject(approvedApartments[i]);
  }
  return approvedApartments;
};

export const getApprovedApartmentsByFilter = async (
  city,
  state,
  minPrice,
  maxPrice,
  rating
) => {
  const searchQuery = { isApproved: true };
  if (city) {
    city = helpers.checkString(city, "city");
    searchQuery.city = { $regex: new RegExp("^" + city + "$", "i") };
  }
  if (state) {
    state = helpers.checkState(state, "state");
    searchQuery.state = { $regex: new RegExp("^" + state + "$") };
  }

  if (minPrice) {
    minPrice = helpers.checkNumber(minPrice, "min price");
    searchQuery.pricePerMonth = { $gte: minPrice };
  }

  if (maxPrice) {
    maxPrice = helpers.checkNumber(maxPrice, "max price");
    if (minPrice) {
      if (maxPrice <= minPrice) throw `Max price must be greater than min.`;
      searchQuery.pricePerMonth.$lte = maxPrice;
    } else {
      searchQuery.pricePerMonth = { $lte: maxPrice };
    }
  }

  if (rating) {
    rating = helpers.checkNumber(rating, "rating");
    searchQuery.rating = { $gte: rating };
  }

  const apartmentCollection = await apartments();
  const apartmentList = await apartmentCollection.find(searchQuery).toArray();
  for (let i = 0; i < apartmentList.length; i++) {
    formatApartmentObject(apartmentList[i]);
  }
  return apartmentList;
};

//if a parameter is left blank it is left unchanged
export async function updateApartmentInfoById(
  id,
  name,
  description,
  address,
  city,
  state,
  dateListed,
  amenities,
  images,
  pricePerMonth,
  landlord,
  rating,
  isApproved
) {
  id = helpers.checkId(id, "apartment id");
  const updateInfo = {};

  if (name !== undefined) updateInfo.name = helpers.checkString(name, "name");
  if (description !== undefined)
    updateInfo.description = helpers.checkString(description, "description");
  if (address !== undefined)
    updateInfo.address = helpers.checkString(address, "address");
  if (city !== undefined) updateInfo.city = helpers.checkString(city, "city");
  if (state !== undefined)
    updateInfo.state = helpers.checkState(state, "state");
  if (dateListed !== undefined)
    updateInfo.dateListed = helpers.checkString(dateListed, "dateListed");
  if (amenities !== undefined)
    updateInfo.amenities = helpers.checkStringArray(amenities, "amenities");
  if (images !== undefined)
    updateInfo.images = helpers.checkStringArray(images, "images");
  if (pricePerMonth !== undefined)
    updateInfo.pricePerMonth = helpers.checkNumber(
      pricePerMonth,
      "pricePerMonth"
    );
  if (landlord !== undefined)
    updateInfo.landlord = helpers.checkId(landlord, "landlord");
  if (rating !== undefined)
    updateInfo.rating = helpers.checkNumber(rating, "rating");
  if (isApproved !== undefined)
    updateInfo.isApproved =
      typeof isApproved === "boolean" ? isApproved : false;

  const parameterNames = getParameterNames(updateApartmentInfoById).slice(1);
  const parameterValues =
    getParameterValueArrayFromArguments(arguments).slice(1);

  for (let i = 0; i < parameterNames.length; i++) {
    if (!parameterValues[i]) {
      continue;
    }
    updateInfo[parameterNames[i]] = parameterValues[i];
  }

  const apartmentCollection = await apartments();
  const result = await apartmentCollection.updateOne(getIdFilter(id), {
    $set: updateInfo,
  });
  if (result.modifiedCount !== 1) {
    throw `No apartment exists with id ${id}`;
  }
  return await getApartmentById(id);
}

export const getUserBookmarkedApartments = async (userId) => {
  userId = helpers.checkString(userId, "userId");
  const user = await users.getUserById(userId);
  let bookmarkedApartments = [];
  for (const id of user.bookmarkedApartments) {
    try {
      const apartment = await getApartmentById(id.toString());
      bookmarkedApartments.push(apartment);
    } catch (e) {
      // apartment not found, means it was deleted --> remove id from bookmark
      await users.removeApartmentFromBookmark(userId, id.toString());
    }
  }

  return bookmarkedApartments;
};

const getParameterNames = (func) => {
  const str = func.toString();
  const paramName = str
    .slice(str.indexOf("(") + 1, str.indexOf(")"))
    .match(/([^\s,]+)/g);
  return paramName || [];
};

const getIdFilter = (id) => {
  return { _id: new ObjectId(id) };
};

const formatApartmentObject = async (apartmentObject) => {
  apartmentObject._id = apartmentObject._id.toString();
  return apartmentObject;
};

const getParameterValueArrayFromArguments = (args) => {
  const output = [];
  const keys = Object.keys(args);
  for (let i = 0; i < keys.length; i++) {
    output.push(args[keys[i]]);
  }
  return output;
};
