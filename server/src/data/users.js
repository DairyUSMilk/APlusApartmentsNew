import { ObjectId } from "mongodb";
import { users } from "./../configs/mongoCollection.js";
import bcrypt from "bcrypt";

export const createUser = async (
  name,
  email,
  password,
  city,
  state,
  dateOfBirth,
  accountType
) => {
  accountType = accountType.toLowerCase();
  if (
    accountType.valueOf() !== "renter" &&
    accountType.valueOf() !== "landlord" &&
    accountType.valueOf() !== "admin"
  ) {
    throw "AccountType attribute must be either 'renter', 'landlord', or 'admin'";
  }
  //TODO: add validation for parameters
  const user = {
    name: name,
    email: email,
    password: await bcrypt.hash(password, 16),
    city: city,
    state: state,
    dateOfBirth: dateOfBirth,
    accountType: accountType,
  };
  const userCollection = await users();
  const output = await userCollection.insertOne(user);
  if (!output.acknowledged || !output.insertedId) {
    throw "User was not inserted into database";
  }
};

export const getUserById = async (id) => {
  const userCollection = await users();
  const user = await userCollection.findOne(getIdFilter(id));
  if (!user) {
    throw `No user exists with id ${id}`;
  }
  return formatUserObject(user);
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
  const result = await userCollection.deleteOne(getIdFilter(id));
  if (result.deletedCount !== 1) {
    throw `No user exists with id ${id}`;
  }
};

//if a field is left blank, it is left unmodified
export const updateUserInfoById = async (
  id,
  name,
  email,
  password,
  city,
  state,
  dateOfBirth,
  accountType
) => {
  const updateInfo = {};

  if (name) {
    updateInfo["name"] = name;
  }
  if (email) {
    updateInfo["email"] = email;
  }
  if (password) {
    updateInfo["password"] = await bcrypt.hash(password, 16);
  }
  if (city) {
    updateInfo["city"] = city;
  }
  if (state) {
    updateInfo["state"] = state;
  }
  if (dateOfBirth) {
    updateInfo["dateOfBirth"] = dateOfBirth;
  }
  if (accountType) {
    updateInfo["accountType"] = accountType;
  }

  const userCollection = await users();
  const result = await userCollection.updateOne(getIdFilter(id), {
    $set: updateInfo,
  });
  if (result.modifiedCount !== 1) {
    throw `No user exists with id ${id}`;
  }
};

//returns user object if attempt is
export const validateLoginAttempt = async (email, password) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  if (!user) {
    throw `Either the email or password is incorrect`;
  }
  if (await bcrypt.compare(password, user.password)) {
    return formatUserObject(user);
  }
  throw `Either the email or password is incorrect`;
};

const getIdFilter = async (id) => {
  return { _id: new ObjectId(id) };
};

const formatUserObject = async (userObject) => {
  delete userObject.password;
  userObject._id = userObject._id.toString();
  return userObject;
};

//need to add function to add apartment listing to either bookmarked, or listing
