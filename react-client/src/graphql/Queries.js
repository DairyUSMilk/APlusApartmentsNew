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

export function getApartmentReviews() {
    return gql`
    query ($uid: String!) {
    getReviewsByApartmentId(_id: $uid) {
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
    query ($uid: String!) {
    getReviewsByUserId(_id: $uid) {
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

