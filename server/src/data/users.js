import { ObjectId } from "mongodb";
import { users } from "./../configs/mongoCollection.js";
import bcrypt from "bcrypt";
import helpers from './../utils/helpers.js';

export const createUser = async(
    name, email, password, city, state, dateOfBirth, accountType) => {
        name = helpers.checkString(name, "name");
        email = helpers.checkEmail(email, "email");
        password = helpers.checkString(password, "password"); 
        city = helpers.checkString(city, "city");
        state = helpers.checkState(state, "state");
        dateOfBirth = helpers.checkDate(dateOfBirth, "dateOfBirth");
        accountType = helpers.checkString(accountType, "accountType").toLowerCase();
    

    if (!["renter", "landlord", "admin"].includes(accountType)) {
        throw "AccountType attribute must be either 'renter', 'landlord', or 'admin'";
    }

    const hashedPassword = await bcrypt.hash(password, 16);
    const user = {
        name,
        email,
        password: hashedPassword,
        city,
        state,
        dateOfBirth,
        accountType,
        bookmarkedApartments: [] 
        // Assuming it's an array to store bookmarked apartment IDs
    }
    const userCollection = await users();
    const output = await userCollection.insertOne(user);
    if(!output.acknowledged || !output.insertedId){
        throw `User with email ${email} was not inserted into database`;
    }
    return await getUserById(output.insertedId.toString());
}

export const getUserById = async(id) => {
    const userCollection = await users();
    const user = await userCollection.findOne(getIdFilter(id));
    if(!user){
        throw `No user exists with id ${id}`;
    }
    return formatUserObject(user);
}

export const getAllUsers = async() => {
    const userCollection = await users();
    const allUsers = await userCollection.find({}).toArray();
    for(let i = 0; i < allUsers.length; i++){
        formatUserObject(allUsers[i]);
    }
    return allUsers;
}

export const getAllRenters = async() => {
    const userCollection = await users();
    const renters = await userCollection.find({accountType: "renter"}).toArray();
    for(let i = 0; i < renters.length; i++){
        formatUserObject(renters[i]);
    }
    return renters;
}

export const getAllLandlords = async() => {
    const userCollection = await users();
    const landlords = await userCollection.find({accountType: "landlord"}).toArray();
    for(let i = 0; i < landlords.length; i++){
        formatUserObject(landlords[i]);
    }
    return landlords;
}

export const deleteUserById = async(id) => {
    const userCollection = await users();
    const result = await userCollection.deleteOne(getIdFilter(id));
    if(result.deletedCount !== 1){
        throw `No user exists with id ${id}`;
    }
}

//if a field is left blank, it is left unmodified
export const updateUserInfoById = async(id, 
    name, email, password, city, 
    state, dateOfBirth, accountType) => {
    const updateInfo = {};
    name = helpers.checkString(name, "name");
    email = helpers.checkEmail(email, "email");
    password = helpers.checkString(password, "password"); 
    city = helpers.checkString(city, "city");
    state = helpers.checkState(state, "state");
    dateOfBirth = helpers.checkDate(dateOfBirth, "dateOfBirth");
    accountType = helpers.checkString(accountType, "accountType").toLowerCase();

    if(name){
        updateInfo["name"] = name;
    }
    if(email){
        updateInfo["email"] = email;
    }
    if(password){
        updateInfo["password"] = await bcrypt.hash(password, 16);
    }
    if(city){
        updateInfo["city"] = city;
    }
    if(state){
        updateInfo["state"] = state;
    }
    if(dateOfBirth){
        updateInfo["dateOfBirth"] = dateOfBirth;
    }
    if(accountType){
        updateInfo["accountType"] = accountType;
    }

    const userCollection = await users();
    const result = await userCollection.updateOne(getIdFilter(id), {$set: updateInfo});
    if(result.modifiedCount !== 1){
        throw `No user exists with id ${id}`;
    }
    return await getUserById(id);
}

//returns user object if attempt is
export const validateLoginAttempt = async(email, password) => {
    const userCollection = await users();
    const user = await userCollection.findOne({email: email});
    if(!user){
        throw `Either the email or password is incorrect`;
    }
    if(await bcrypt.compare(password, user.password)){
        return formatUserObject(user);
    }
    throw `Either the email or password is incorrect`;
}

const getIdFilter = async(id) => {
    return {_id: new ObjectId(id)};
}

const formatUserObject = async(userObject) => {
    delete userObject.password;
    userObject._id = userObject._id.toString();
    return userObject;
}

export const addApartmentToBookmark = async(userId, apartmentId) => {
    userId = helpers.checkId(userId, "userId");
    apartmentId = helpers.checkId(apartmentId, "apartmentId");

    const userCollection = await users();
    const updateResult = await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { bookmarkedApartments: new ObjectId(apartmentId) } }
    );

    if (updateResult.modifiedCount !== 1) {
        throw `Apartment ${apartmentId} could not be bookmarked by user ${userId}`;
    }
    return await getUserById(userId);
};

