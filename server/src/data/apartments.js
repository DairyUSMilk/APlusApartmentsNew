import { ObjectId } from "mongodb";
import { apartments } from "./../configs/mongoCollection.js";
import helpers from './helpers';

export const createApartment = async(name, description, address, city, 
    state, dateListed, amenities, images, pricePerMonth, landlord, 
    rating, isApproved) => {

        name = helpers.checkString(name, "name");
        description = helpers.checkString(description, "description");
        address = helpers.checkString(address, "address");
        city = helpers.checkString(city, "city");
        state = helpers.checkState(state, "state");
        dateListed = helpers.checkString(dateListed, "dateListed"); 
        amenities = helpers.checkStringArray(amenities, "amenities");
        images = helpers.checkStringArray(images, "images");
        pricePerMonth = helpers.checkNumber(pricePerMonth, "pricePerMonth");
        landlord = helpers.checkId(landlord, "landlord"); 
        rating = helpers.checkNumber(rating, "rating"); 
        isApproved = typeof isApproved === 'boolean' ? isApproved : false;
    
    // Added validation for parameters

    const apartment = {
        name: name,
        description: description, 
        address: address, 
        city: city, 
        state: state, 
        dateListed: dateListed,
        amenities: amenities,
        images: images, 
        pricePerMonth: pricePerMonth,
        landlord: landlord,
        rating: rating,
        isApproved: isApproved
    }
    const apartmentCollection = await apartments();
    const output = await apartmentCollection.insertOne(apartment);
    if(!output.acknowledged || !output.insertedId){
        throw `Apartment named ${name} was not inserted into database`;
    }
}

export const getApartmentById = async(id) => {
    const apartmentCollection = await apartments();
    const apartment = await apartmentCollection.findOne(getIdFilter(id));
    if(!apartment){
        throw `No apartment exists with id ${id}`;
    }
    return formatApartmentObject(apartment);
}

export const getAllApartments = async() => {
    const apartmentCollection = await apartments();
    const apartmentList = await apartmentCollection.find({}).toArray();
    for(let i = 0; i < apartmentList.length; i++){
        formatApartmentObject(apartmentList[i]);
    }
    return apartmentList;
}

export const deleteApartmentById = async(id) => {
    const apartmentCollection = await apartments();
    const result = await apartmentCollection.deleteOne(getIdFilter(id));
    if(result.deletedCount !== 1){
        throw `No apartment exists with id ${id}`;
    }
}

export const approveApartmentById = async(id) => {
    const apartmentCollection = await apartments();
    const updateInfo = {$set: {isApproved: true}};
    const result = await apartmentCollection.updateOne(getIdFilter(id), updateInfo);
    if(result.modifiedCount !== 1){
        throw `No apartment exists with id ${id}`;
    }
}

export const getApartmentsByLandlordId = async(id) => {
    const apartmentCollection = await apartments();
    const apartments = await apartmentCollection.find({landlord: new ObjectId(id)}).toArray()
    for(let i = 0; i < apartments.length; i++){
        formatApartmentObject(apartments[i]);
    }
    return apartments;
}

export const getAllApartmentsPendingApproval = async() => {
    const apartmentCollection = await apartments();
    const apartments = await apartmentCollection.find({isApproved: false}).toArray();
    for(let i = 0; i < apartments.length; i++){
        formatApartmentObject(apartments[i]);
    }
    return apartments
}

export const getAllApprovedApartments = async() => {
    const apartmentCollection = await apartments();
    const apartments = await apartmentCollection.find({isApproved: true}).toArray();
    for(let i = 0; i < apartments.length; i++){
        formatApartmentObject(apartments[i]);
    }
    return apartments
}

//if a parameter is left blank it is left unchanged
export async function updateApartmentInfoById(id, 
    name, description, address, city, state, dateListed, amenities, 
    images, pricePerMonth, landlord, rating, isApproved){

    id = helpers.checkId(id, "id");
    const updateInfo = {};

    if (name !== undefined) updateInfo.name = helpers.checkString(name, "name");
    if (description !== undefined) updateInfo.description = helpers.checkString(description, "description");
    if (address !== undefined) updateInfo.address = helpers.checkString(address, "address");
    if (city !== undefined) updateInfo.city = helpers.checkString(city, "city");
    if (state !== undefined) updateInfo.state = helpers.checkState(state, "state");
    if (dateListed !== undefined) updateInfo.dateListed = helpers.checkString(dateListed, "dateListed");
    if (amenities !== undefined) updateInfo.amenities = helpers.checkStringArray(amenities, "amenities");
    if (images !== undefined) updateInfo.images = helpers.checkStringArray(images, "images");
    if (pricePerMonth !== undefined) updateInfo.pricePerMonth = helpers.checkNumber(pricePerMonth, "pricePerMonth");
    if (landlord !== undefined) updateInfo.landlord = helpers.checkId(landlord, "landlord");
    if (rating !== undefined) updateInfo.rating = helpers.checkNumber(rating, "rating");
    if (isApproved !== undefined) updateInfo.isApproved = typeof isApproved === 'boolean' ? isApproved : false;
    // Added validation for parameters

    const apartmentCollection = await apartments();
    const result = await apartmentCollection.updateOne(getIdFilter(id), {$set: updateInfo});
    if(result.modifiedCount !== 1){
        throw `No apartment exists with id ${id}`;
    }
}

const getParameterNames = (func) => {
    const str = func.toString();
    const paramName = str.slice(str.indexOf('(') + 1, str.indexOf(')')).match(/([^\s,]+)/g);
    return paramName || [];
}

const getIdFilter = async(id) => {
    return {_id: new ObjectId(id)};
}

const formatApartmentObject = async(apartmentObject) => {
    apartmentObject._id = apartmentObject._id.toString();
    return apartmentObject;
}

const getParameterValueArrayFromArguments = (args) => {
    const output = [];
    const keys = Object.keys(args);
    for(let i = 0; i < keys.length; i++){
        output.push(args[keys[i]]);
    }
    return output;
}