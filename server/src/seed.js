import * as users from "./data/users.js";
import * as apartments from "./data/apartments.js";
import * as reviews from "./data/reviews.js";

import { dbConnection, closeConnection } from "./configs/mongoConnections.js";
const db = await dbConnection();
await db.dropDatabase();

/****
 ALL RENTER/LANDLORD/ADMIN ACCOUNTS HAVE THE PASSWORD: 
 Password123!
 *****/

// These auth accounts have already been created in firebase
// with the specified user id below. The email saved in db is
// the email you'll sigh in with.
const renterIds = [
  "rUQIELok8IgFb7SWlJLLgk5LGuC3",
  "wy0Q9dwpvNTOLjJE35BxRf0QkhH3",
  "acdBvWG56VQlRokowkuEhIDKFrj2",
  "raJ5EWxpmWdy7PKDyCtZA9TvS9v1",
  "o0faL0ao1sbOYY9ZGMg2zqHxpUn1",
];

const landlordIds = [
  "Vg6Tz2nHKtTyt7hCN5RrcOrtRF63",
  "KMRb5uTNNjWMx4Hc8K23mIIKo3N2",
  "vJc4GkpWota7DgztnUDBSZnbPUH2",
  "MjFvFURVxcfeaf2LIuuhKJFKhBo1",
  "1PF6g1AXs9WSbV6sjzsx0gnmpwy1",
];

const adminIds = [
  "kusC2VshdYPx2eajJChR0WI8p4H2",
  "sLwGgCRIH5QerMURKIdPqCWIFSL2",
  "cBEfSVXhBTaDowaICBcvHqQsGKj2",
];

const addresses = [
  ["132 Adams St", "Hoboken", "NJ"], // 07030-2518 USA
  ["1034 Clinton St", "Hoboken", "NJ"], // 07030-3133 USA
  ["1313 Willow Ave Apt 2A", "Hoboken", "NJ"], // NJ 07030-3300 USA
  ["1000 Bloomfield St", "Hoboken", "NJ"], //07030-5204 USA
  ["1008 Washington St Apt 1F", "Hoboken", "NJ"], //07030-5244 USA
  ["322 Grove ST", "Jersey City", "NJ"], //07302-2943 USA
  ["135 Montgomery St Apt 5E", "Jersey City", "NJ"], //07302-4656 USA
  ["161 Lexington Ave Apt 2L", "Jersey City", "NJ"], //07304-1232 USA
  ["79 Leonard St", "Jersey City", "NJ"], //07307-3101 USA
  ["98 Lincoln St", "Jersey City", "NJ"], //07307-4520 USA
  ["577 Grand St", "New York", "NY"], //10002-3690 USA
  ["23 Morningside Ave", "New York", "NY"], //10026-2046 USA
  ["150 E 58TH St", "New York", "NY"], //10155-2301 USA
  ["68 Purchase St", "Rye", "NY"], //10580-3050 USA
  ["336 Route 202", "Somers", "NY"], //10589-3221 USA
  ["763 Eastern Pkwy", "Brooklyn", "NY"], //11213-3425 USA
];

const populateUsers = async () => {
  const genders = ["male", "female", "other", "prefer not to say"];
  for (let i = 1; i <= renterIds.length; i++) {
    // create renters
    const randomAddressIndex = getRandomInt(0, addresses.length);
    const genderIndex = getRandomInt(0, 4);
    await users.createUser(
      renterIds[i - 1],
      `Renter ${i}`,
      `testrenter${i}@email.com`,
      addresses[randomAddressIndex][1],
      addresses[randomAddressIndex][2],
      `${i}/${i}/2000`,
      genders[genderIndex],
      "renter"
    );
  }

  // create landlords
  for (let i = 1; i <= landlordIds.length; i++) {
    const randomAddressIndex = getRandomInt(0, addresses.length);
    await users.createUser(
      landlordIds[i - 1],
      `Landlord ${i}`,
      `testlandlord${i}@email.com`,
      addresses[randomAddressIndex][1],
      addresses[randomAddressIndex][2],
      `${i}/${i}/2000`,
      "male",
      "landlord"
    );
  }

  // create admins
  for (let i = 1; i <= adminIds.length; i++) {
    const randomAddressIndex = getRandomInt(0, addresses.length);
    await users.createUser(
      adminIds[i - 1],
      `Admin ${i}`,
      `testadmin${i}@email.com`,
      addresses[randomAddressIndex][1],
      addresses[randomAddressIndex][2],
      `${i}/${i}/2000`,
      "female",
      "admin"
    );
  }
};

const populateApartments = async () => {
  const randomAmenityLists = [
    ["fitness center", "parking", "pool"],
    ["internet", "laundry"],
    ["balcony", "cable", "laundry", "parking"],
  ];

  for (let i = 1; i <= addresses.length; i++) {
    const randomAmenityIndex = getRandomInt(0, randomAmenityLists.length);
    const apartment = await apartments.createApartment(
      `Apartment ${i}`,
      `Description ${i}`,
      addresses[i - 1][0],
      addresses[i - 1][1],
      addresses[i - 1][2],
      `${i <= 12 ? i : addresses.length - i}/${i + 1}/2023`,
      randomAmenityLists[randomAmenityIndex],
      //[`Image for Apartment ${i}`],
      getRandomInt(500, 4000),
      landlordIds[getRandomInt(0, landlordIds.length)]
    );
    await apartments.approveApartmentById(apartment._id.toString());
  }
};

const populateReviews = async () => {
  const apartmentsList = await apartments.getAllApartments();
  const reviewContents = ["Terrible", "Bad", "Okay", "Good", "Great"];
  for (let i = 0; i < 100; i++) {
    const reviewRating = getRandomInt(1, 6);
    const review = await reviews.createReview(
      renterIds[getRandomInt(0, renterIds.length)],
      apartmentsList[getRandomInt(0, apartmentsList.length)]._id.toString(),
      reviewRating,
      `${reviewContents[reviewRating - 1]} Review Content for Review ${i}`,
      `${getRandomInt(1, 12)}/${getRandomInt(1, 28)}/2023`
    );
    await reviews.approveReviewById(review._id.toString());
  }
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

await populateUsers();
await populateApartments();
await populateReviews();
await closeConnection();
