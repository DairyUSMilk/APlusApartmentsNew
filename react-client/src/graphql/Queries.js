import { gql } from "@apollo/client";

export function getUserAccountType() {
    return gql`
    query ($id: String!) {
    getUserAccountType(id: $id)
    }
    `;
}

export function getRenter() {
    return gql`
    query ($id: String!) {
    getRenterById(id: $id) {
        id
        name
        dateOfBirth
        gender
        savedApartments {
            id
            name
            address
            price
            landlord {
                id
            }
        }
    }
    }
    `;
}

export function getLandlord() {
    return gql`
    query ($id: String!) {
    getLandlordById(id: $id) {
        id
        name
        contactInfo
        savedApartments {
            id
            name
            address
            price
            landlord {
                id
            }
        }
        ownedApartments {
            id
            name
            address
            description
            price
            landlord {
                id
            }
        }
    }
    }
    `;
}

export function getAdmin() {
    return gql`
    query ($id: String!) {
    getAdminById(id: $id) {
        id
        name
        savedApartments {
            id
            name
            address
            price
            landlord {
                id
            }
        }
    }
    }
    `;
}

export function getApartment() {
    return gql`
    query ($id: String!) {
    getApartmentById(id: $id) {
        id
        name
        address
        description
        price
        amenities
        landlord {
            id
            name
            contactInfo
        }
        reviews {
            id
            posterId
            rating
            content
            datePosted
        }
    }
    }
    `;
}

export function getUserReviews() {
    return gql`
    query ($posterId: String!) {
    reviews(posterId: $posterId) {
        id
        posterId
        apartmentId
        rating
        content
        datePosted
    }
    }
    `;
}

export function getPendingReviews() {
    return gql`
    {
    pendingReviews {
        id
        posterId
        apartmentId
        rating
        content
        datePosted
    }
    }
    `;
}

export function getApprovedApartments() {
    return gql`
    query (
        $city: String,
        $state: String,
        $minPrice: Float,
        $maxPrice: Float,
        $rating: Float) {
    apartments (
        city: $city,
        state: $state,
        minPrice: $minPrice,
        maxPrice: $maxPrice,
        rating: $rating
    ) {
        id
        name
        address
        description
        price
        amenities
        reviews {
            id
            posterId
            rating
            content
            datePosted
        }
        landlord {
            id
            name
            contactInfo
        }
    }
    }
    `;
}

export function getPendingApartments() {
    return gql`
    {
    pendingApartments {
        id
        address
        description
        images
        price
        amenities
        landlord {
            name
        }
    }
    }
    `;
}

