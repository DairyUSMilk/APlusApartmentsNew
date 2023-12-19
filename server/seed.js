import * as users from "./src/data/users.js";
import * as apartments from "./src/data/apartments.js";
import * as reviews from "./src/data/reviews.js";

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
            landlords[getRandomInt(0, landlords.length)].uid
        );
    }
}

const populateReviews = async() => {
    const renters = await users.getAllRenters();
    const apartmentsList = await apartments.getAllApartments();
    for(let i = 0; i < 100; i++){
        await reviews.createReview(
            renters[getRandomInt(0, renters.length)].uid,
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
let id = "657fd12aeef580fe50bf1907";