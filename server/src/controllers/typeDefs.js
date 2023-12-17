export const typeDefs = `#graphql
    type Query {
        renters: [Renter]
        landlords: [Landlord]
        reviews: [Review]
        getRenterById(uid: String!): Renter
        getLandlordById(uid: String!): Landlord
        getAdminById(uid: String!): Admin
        getUserAccountType(uid: String!): String
    }
    type Renter{
        uid: String!
        name: String!
        dateOfBirth: String!
        gender: String!
        preferences: Preferences
        savedApartments: [Apartment]
    }
    type Landlord {
        uid: String!,
        name: String!
        contactInfo: String!
        ownedApartments: [Apartment]

    }
    type Apartment {
        id: String!
        address: String!
        description: String
        images: [String]
        price: Float!
        amenities: [String]
        landlord: Landlord!
        reviews: [Review]
    }
    type Review{
        posterId: String!
        apartmentId: String!
        rating: Int!
        content: String!
        datePosted: String!
    }
    type Preferences {
        location: String
        priceRange: PriceRange
        other: [String]
    }

    type PriceRange {
        min: Float
        max: Float
    }
    type Mutation{
        addRenter(
            uid: String!
            email: String!
            name: String!
            dateOfBirth: String!
            gender: String!
            city: String!
            state: String!
            preferences: [String]
            savedApartments: [String]
        ): Renter
        editRenter(
            uid: String!
            name: String
            dateOfBirth: String
            gender: String
            preferences: [String]
            savedApartments: [String]
        ):Renter
        removeRenter(
            uid: String!
        ): Renter
        addLandlord(
            uid: String!
            email: String!
            name: String!
            dateOfBirth: String!
            gender: String!
            city: String!
            state: String!
            ownedApartments: [String]
        ): Landlord
        editLandlord(
            uid: String!
            name: String
            contactInfo: String
            ownedApartments: [String]
        ): Landlord
        removeLandlord(
            uid: String!
        ): Landlord
        createReview(
            posterId: String!
            apartmentId: String!
            rating: String!
            content: String
            datePosted: String
        ): Review
        updateReview(
            posterId: String!
            apartmentId: String
            rating: String
            content: String
            datePosted: String
        ): Review
        deleteReview(
            posterId: String!
        ): Review
        approveReview(
            posterId: String!
        ): Review

    }
`;
