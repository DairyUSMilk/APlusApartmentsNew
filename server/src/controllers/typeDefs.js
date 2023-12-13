export const typeDefs = `#graphql
    type Query {
        renters: [Renter]
        landlords: [Landlord]
        getRenterById(_id: String!): Renter
        getLandlordsById(_id: String!): Landlord
    }
    type Renter{
        _id: String!
        group: Group
        name: String!
        dateOfBirth: String!
        gender: String!
        preferences: Preferences
        savedApartments: [Apartment]
    }
    type Landlord {
        _id: String!,
        name: String!,
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
        groups: Group
        reviews: [Review]
    }
    type Review{
        posterId: String!
        apartmentId: String!
        rating: Int!
        content: String!
        datePosted: String!
    }
    type Group{
        id: String!
        apartment: Apartment!
        members: [Renter]
        groupImages: [String]
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
            _id: String!,
            group: Group,
            name: String!,
            dateOfBirth: String!,
            gender: String!,
            preferences: Preferences,
            savedApartments: [Apartment]
        ): Renter
        editRenter(
            _id: String!,
            group: Group,
            name: String,
            dateOfBirth: String,
            gender: String,
            preferences: Preferences,
            savedApartments: [Apartment]
        ):Renter
        removeRenter(
            _id: String!
        ): Renter
        addLandlord(
            _id: String!
            name: String!
            contactInfo: String!
            ownedApartments: [Apartment]
        ): Landlord
        editLandlord(
            _id: String!
            name: String
            contactInfo: String
            ownedApartments: [Apartment]
        )
        removeLandlord(
            _id: String!
        ): Landlord
        createReview(
            posterId: String!
            apartmentId: String!
            rating: String!
            content: String
            datePosted: String
        )
        updateReview(
            posterId: String!
            apartmentId: String
            rating: String
            content: String
            datePosted: String
        )
        deleteReview(
            posterId: String!
        )
        approveReview(
            posterId: String!
        )


    }
`;
