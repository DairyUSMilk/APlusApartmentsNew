import { ObjectId } from "mongodb";
import { users } from "./../configs/mongoCollection.js";
import bcrypt from "bcrypt";
import helpers from "./../utils/helpers.js";

export const createUser = async (
  id,
  name,
  email,
  city,
  state,
  dateOfBirth,
  gender,
  accountType
) => {
  id = id;
  name = helpers.checkString(name, "name");
  email = helpers.checkEmail(email, "email");
  city = helpers.checkString(city, "city");
  state = helpers.checkState(state, "state");
  dateOfBirth = helpers.checkDate(dateOfBirth, "dateOfBirth");
  gender = helpers.checkString(gender, "gender");
  accountType = helpers.checkString(accountType, "accountType").toLowerCase();

  if (!["renter", "landlord", "admin"].includes(accountType)) {
    throw "AccountType attribute must be either 'renter', 'landlord', or 'admin'";
  }

  const user = {
    _id: id,
    name,
    email,
    city,
    state,
    dateOfBirth,
    gender,
    accountType,
    bookmarkedApartments: [],
    // Assuming it's an array to store bookmarked apartment IDs
  };
  const userCollection = await users();
  const output = await userCollection.insertOne(user);
  if (!output.acknowledged || !output.insertedId) {
    throw `User with email ${email} was not inserted into database`;
  }
  return await getUserById(output.insertedId);
};

export const getUserById = async (id) => {
  id = helpers.checkString(id);
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: id });
  if (!user) {
    throw `No user exists with id ${id}`;
  }
  return formatUserObject(user);
};

export const getAllUsers = async () => {
  const userCollection = await users();
  const allUsers = await userCollection.find({}).toArray();
  for (let i = 0; i < allUsers.length; i++) {
    formatUserObject(allUsers[i]);
  }
  return allUsers;
};

export const getAllRenters = async () => {
  const userCollection = await users();
  const renters = await userCollection
    .find({ accountType: "renter" })
    .toArray();
  for (let i = 0; i < renters.length; i++) {
    formatUserObject(renters[i]);
  }
  return renters;
};

export const getAllLandlords = async () => {
  const userCollection = await users();
  const landlords = await userCollection
    .find({ accountType: "landlord" })
    .toArray();
  for (let i = 0; i < landlords.length; i++) {
    formatUserObject(landlords[i]);
  }
  return landlords;
};

export const deleteUserById = async (id) => {
  const userCollection = await users();
  const user = await getUserById(id);
  const result = await userCollection.deleteOne(getIdFilter(id));
  if (result.deletedCount !== 1) {
    throw `No user exists with id ${id}`;
  }
  return user;
};

//if a field is left blank, it is left unmodified
export const updateUserInfoById = async (
  id,
  name,
  email,
  gender,
  city,
  state,
  dateOfBirth,
  accountType
) => {
  const updateInfo = {};
  id = helpers.checkString(id, "id");

  if (name) {
    updateInfo["name"] = helpers.checkString(name, "name");
  }
  if (email) {
    updateInfo["email"] = helpers.checkEmail(email, "email");
  }
  if (gender) {
    updateInfo["gender"] = helpers.checkString(gender, "gender");
  }
  if (city) {
    updateInfo["city"] = helpers.checkString(city, "city");
  }
  if (state) {
    updateInfo["state"] = helpers.checkState(state, "state");
  }
  if (dateOfBirth) {
    updateInfo["dateOfBirth"] = helpers.checkDate(dateOfBirth, "dateOfBirth");
  }
  if (accountType) {
    updateInfo["accountType"] = helpers
      .checkString(accountType, "accountType")
      .toLowerCase();
  }

  const userCollection = await users();
  const result = await userCollection.updateOne(getIdFilter(id), {
    $set: updateInfo,
  });
  if (result.modifiedCount !== 1) {
    throw `No user exists with id ${id}`;
  }
  return await getUserById(id);
};

//returns user object if attempt is
export const validateLoginAttempt = async (email, password) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  if (!user) {
    throw `Either the email or password is incorrect`;
  }
};

const getIdFilter = async (id) => {
  return { _id: id };
};

const formatUserObject = async (userObject) => {
  //delete userObject.password;
  //userObject._id = userObject._id.toString();
  return userObject;
};

export const addApartmentToBookmark = async (userId, apartmentId) => {
  userId = helpers.checkString(userId, "userId");
  apartmentId = helpers.checkId(apartmentId, "apartmentId");

  const userCollection = await users();
  const updateResult = await userCollection.updateOne(
    { _id: userId },
    { $addToSet: { bookmarkedApartments: new ObjectId(apartmentId) } }
  );

  if (updateResult.modifiedCount !== 1) {
    throw `Apartment ${apartmentId} could not be bookmarked by user ${userId}`;
  }
  return await getUserById(userId);
};

export const removeApartmentFromBookmark = async (userId, apartmentId) => {
  userId = helpers.checkString(userId, "userId");
  apartmentId = helpers.checkId(apartmentId, "apartmentId");

  const userCollection = await users();
  const updateResult = await userCollection.updateOne(
    { _id: userId },
    { $pull: { bookmarkedApartments: new ObjectId(apartmentId) } }
  );

  if (updateResult.modifiedCount !== 1) {
    throw `Apartment ${apartmentId} could remove bookmark by user ${userId}`;
  }
  return await getUserById(userId);
};
