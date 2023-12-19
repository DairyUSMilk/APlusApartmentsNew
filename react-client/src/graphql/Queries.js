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
        name
        dateOfBirth
        gender
        savedApartments {
            id
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
        name
        contactInfo
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
        name
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
    {
    apartments {
        id
        address
        description
        images
        price
        amenities
        reviews {
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

