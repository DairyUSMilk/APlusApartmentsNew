export const typeDefs = `#graphql
    type Query {
        renters: [Renter]
        landlords: [Landlord]
        apartments: [Apartment]
        pendingApartments: [Apartment]
        reviews(posterId: String!): [Review]
        pendingReviews: [Review]
        getRenterById(id: String!): Renter
        getLandlordById(id: String!): Landlord
        getAdminById(id: String!): Admin
        getUserAccountType(id: String!): String
        getApartmentById(id: String!): Apartment
    }
    type Renter{
        id: String!
        name: String!
        dateOfBirth: String!
        gender: String!
        savedApartments: [Apartment]
    }
    type Landlord {
        id: String!
        name: String!
        contactInfo: String!
        savedApartments: [Apartment]
        ownedApartments: [Apartment]
    }
    type Admin {
        id: String!
        name: String!
        savedApartments: [Apartment]
    }
    type Apartment {
        id: String!
        name: String!
        address: String!
        description: String
        images: [String]
        price: Float!
        amenities: [String]
        landlord: Landlord
        reviews: [Review]
    }
    type Review{
        id: String!
        posterId: String!
        apartmentId: String!
        rating: Int!
        content: String!
        datePosted: String!
    }
    type Mutation{
        addRenter(
            id: String!
            email: String!
            name: String!
            city: String!
            state: String!
            dateOfBirth: String!
            gender: String!
            savedApartments: [String]
        ): Renter
        editRenter(
            id: String!
            name: String
            dateOfBirth: String
            gender: String
            savedApartments: [String]
        ):Renter
        addApartment(
            name: String!
            address: String!
            city: String!
            state: String!
            description: String
            images: [String]
            price: Float!
            amenities: [String]!
            landlordId: String!
        ): Apartment
        removeApartment(
            id: String!
        ): Apartment
        removeRenter(
            id: String!
        ): Renter
        addLandlord(
            id: String!
            email: String!
            name: String!
            dateOfBirth: String!
            gender: String!
            city: String!
            state: String!
            ownedApartments: [String]
        ): Landlord
        editLandlord(
            id: String!
            name: String
            contactInfo: String
            ownedApartments: [String]
        ): Landlord
        removeLandlord(
            id: String!
        ): Landlord
        addAdmin(
            id: String!
            email: String!
            name: String!
            dateOfBirth: String!
            gender: String!
            city: String!
            state: String!
        ): Admin
        editAdmin(
            id: String!
            name: String
        ): Admin
        removeAdmin(
            id: String!
        ): Admin
        createReview(
            posterId: String!
            apartmentId: String!
            rating: Int!
            content: String
            datePosted: String
        ): Review
        updateReview(
            id: String!
            posterId: String!
            apartmentId: String
            rating: Int
            content: String
            datePosted: String
        ): Review
        deleteReview(
            id: String!
        ): Review
        approveReview(
            id: String!
        ): Review
        approveApartment(
            id: String!
        ): Apartment
        addBookmark(
            userId: String!
            apartmentId: String!
        ): String
        removeBookmark(
            userId: String!
            apartmentId: String!
        ): String
    }
`;
