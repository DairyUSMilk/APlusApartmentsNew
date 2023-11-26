export const typeDefs = `#graphql
    type Query {
        renters: [Renter]
        landlords: [Landlord]
        getRenterById(_id: String!): Renter
        getLandlordsById(_id: String!): Landlord
    }
    type Renter{
        _id: String!,
        group: Group,
        name: String!,
        age: Int!
        gender: String!,
        preferences: Preferences,
        swipedApartments: [Apartment]
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

`;
