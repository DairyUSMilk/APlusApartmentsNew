import * as users from "./users.js";
import * as apartments from "./apartments.js";
import * as reviews from "./reviews.js";
import { ObjectId } from "mongodb";

const populateUsers = async() => {
    for(let i = 1; i <= 10; i++){
        await users.createUser(
            `Name ${i}`, 
            `email${i}@email.com`,
            `city${i}`,
            `NY`,
            `${i}/${i}/2000`,
            "renter"
        );
    }

    for(let i = 1; i <= 5; i++){
        await users.createUser(
            `Landlord ${i}`,
            `landlord${i}@gmail.com`,
            `city${i}`,
            `NJ`,
            `${i}/${i}/2000`,
            "landlord"
        );
    }
}

const populateApartments = async() => {
    const landlords = await users.getAllLandlords();
    console.log(landlords);
    for(let i = 1; i <= 20; i++){
        await apartments.createApartment(
            `Apartment ${i}`,
            `Description ${i}`,
            `Address for Apartment ${i}`,
            `City ${i}`,
            `NJ`,
            `${i}/${i + 1}/2023`,
            [`Amenities for Apartment ${i}`],
            [`Image for Apartment ${i}`],
            300 + i,
            landlords[getRandomInt(0, landlords.length)]._id
        );
    }
}

const populateReviews = async() => {
    const renters = await users.getAllRenters();
    const apartmentsList = await apartments.getAllApartments();
    for(let i = 0; i < 100; i++){
        await reviews.createReview(
            renters[getRandomInt(0, renters.length)]._id,
            apartmentsList[getRandomInt(0, apartmentsList.length)]._id,
            getRandomInt(0, 5),
            `Review Content for Review ${i}`,
            `12/12/2023`
        )
    }
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min); 
    max = Math.floor(max) - 1; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

await populateUsers();
await populateApartments();
await populateReviews();