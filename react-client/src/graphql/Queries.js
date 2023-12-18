import { gql } from "@apollo/client";

export function getUserAccountType() {
    return gql`
    query ($uid: String!) {
    getUserAccountType(uid: $uid)
    }
    `;
}

export function getRenter() {
    return gql`
    query ($uid: String!) {
    getRenterById(uid: $uid) {
        name
        dateOfBirth
        gender
        savedApartments {
            id
            address
            price
            landlord {
                uid
            }
        }
    }
    }
    `;
}

export function getLandlord() {
    return gql`
    query ($uid: String!) {
    getLandlordById(uid: $uid) {
        name
        contactInfo
        ownedApartments {
            id
            address
            price
        }
    }
    }
    `;
}

export function getAdmin() {
    return gql`
    query ($uid: String!) {
    getAdminById(uid: $uid) {
        name
    }
    }
    `;
}

export function getApartment() {
    return gql`
    query ($id: String!) {
    getApartmentById(_id: $id) {
        id
        address
        description
        images
        price
        amenities
        landlord {
            uid
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
    {
    query ($posterId: String!) {
    reviews(posterId: $posterId) {
        apartmentId
        rating
        content
        datePosted
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
        groups
        reviews {
            posterId
            rating
            content
            datePosted
        }
        landlord {
            name
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
        groups
        reviews
        landlord {
            name
        }
    }
    `;
}

