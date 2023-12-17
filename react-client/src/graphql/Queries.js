import { gql } from "@apollo/client";

export function getUserAccountType() {
    return gql`
    query ($id: String!) {
    getUserAccountType(uid: $id)
    }
    `;
}

export function getRenter() {
    return gql`
    query ($id: String!) {
    getRenterById(uid: $id) {
        name
        dateOfBirth
        gender
        savedApartments {
            id
            address
            price
        }
    }
    }
    `;
}

export function getLandlord() {
    return gql`
    query ($id: String!) {
    getLandlordById(uid: $id) {
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
    query ($id: String!) {
    getAdminById(uid: $id) {
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

export function getApartmentReviews() {
    return gql`
    query ($id: String!) {
    getReviewsByApartmentId(_id: $id) {
        posterId
        rating
        content
        datePosted
    }
    `;
}

export function getUserReviews() {
    return gql`
    {
    query ($id: String!) {
    getReviewsByUserId(_id: $id) {
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
    getPendingReviews {
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
        reviews
        landlord {
            name
        }
    }
    `;
}

export function getPendingApartments() {
    return gql`
    {
    getPendingApartments {
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

