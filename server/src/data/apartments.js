import { ObjectId } from "mongodb";
import { apartments } from "./../configs/mongoCollection.js";

export const createApartment = async(name, description, address, city, 
    state, dateListed, amenities, images, pricePerMonth, landlord, 
    rating, isApproved) => {
    //TODO: add validation for parameters
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

export const getAllApartments = async(id) => {
    const apartmentCollection = await apartments();
    const apartments = await apartmentCollection.find({}).toArray();
    for(let i = 0; i < apartments.length; i++){
        formatApartmentObject(apartments[i]);
    }
    return apartments;
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

const getIdFilter = async(id) => {
    return {_id: new ObjectId(id)};
}

const formatApartmentObject = async(apartmentObject) => {
    apartmentObject._id = apartmentObject._id.toString();
    return apartmentObject;
}