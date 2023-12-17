import { gql } from "@apollo/client";

export function getUserAccountType(id) {
    return gql`
    {
    getUserAccountType(_id:${id})
    }
    `;
}

export function getRenter(id) {
    return gql`
    {
    getRenterById(_id: "${id}") {
        _id
        group
        name
        age
        gender
        preferences
        swipedApartments
    }
    `;
}

export function getLandlord(id) {
    return gql`
    {
    getLandlordById(_id: "${id}") {
        name
        contactInfo
        ownedApartments
    }
    `;
}

export function getApartmentReviews(id) {
    return gql`
    {
    getReviewsByApartmentId(_id: "${id}") {
        posterId
        rating
        content
        datePosted
    }
    `;
}

export function getUserReviews(id) {
    return gql`
    {
    getReviewsByUserId(_id: "${id}") {
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

