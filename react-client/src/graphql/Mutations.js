import { gql } from "@apollo/client";

export function createRenter() {
    return gql`
    mutation AddRenter(
        $uid: String!,
        $email: String!,
        $name: String!,
        $dateOfBirth: String!,
        $gender: String!,
        $city: String!,
        $state: String!,
    ) {
    addRenter(
        uid: $uid
        email: $email
        name: $name
        dateOfBirth: $dateOfBirth
        gender: $gender
        city: $city
        state: $state
        ) {
        uid
        name
        dateOfBirth
        gender
    }
    }
    `;
}

export function createLandlord() {
    return gql`
    mutation AddLandlord(
        $uid: String!,
        $email: String!,
        $name: String!,
        $dateOfBirth: String!,
        $gender: String!,
        $city: String!,
        $state: String!,
    ) {
    addLandlord(
        uid: $uid
        email: $email
        name: $name
        dateOfBirth: $dateOfBirth
        gender: $gender
        city: $city
        state: $state
        ) {
        uid
        name
        contactInfo
    }
    }
    `;
}

export function createAdmin() {
    return gql`
    mutation AddAdmin(
        $uid: String!,
        $email: String!,
        $name: String!,
        $dateOfBirth: String!,
        $gender: String!,
        $city: String!,
        $state: String!,
    ) {
    addAdmin(
        uid: $uid
        email: $email
        name: $name
        dateOfBirth: $dateOfBirth
        gender: $gender
        city: $city
        state: $state
        ) {
        uid
        name
    }
    }
    `;
}

export function createApartment() {
    return gql`
    mutation AddApartment(
        $address: String!, 
        $price: Float!, 
        $amenities: [String]!,
        $landlordId: String!,
        $description: String,
        $images: [String]) {
        addApartment(
            address: $address, 
            price: $price, 
            amenities: $amenities,
            landlordId: $landlordId, 
            description: $description, 
            images: $images) {
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

export function deleteApartment() {
    return gql`
    mutation RemoveApartment($uid: String!) {
    removeApartment(uid: $uid) {
        id
    }
    }
    `;
}

export function approveApartment() {
    return gql`
    mutation ApproveApartment($uid: String!) {
        approveApartment(iod: $uid) {
          id
        }
    }
    `;
}

export function createReview() {
    return gql`
    mutation CreateReview(
        $posterId: String!, 
        $apartmentId: String!, 
        $rating: String!,
        $content: String, 
        $datePosted: String) {
        createReview(
            posterId: $posterId, 
            apartmentId: $apartmentId, 
            rating: $rating, 
            content: $content,
            datePosted: $datePosted) {
          posterId
          apartmentId
          rating
          content
          datePosted
        }
      }
      `;
}

export function deleteReview() {
    return gql`
    mutation DeleteReview($id: String!) {
        deleteReview(id: $id) {
        posterId
        }
    }
  `;
}

export function approveReview() {
    return gql`
    mutation ApproveReview($id: String!) {
        approveReview(id: $id) {
          posterId
        }
    }
    `;
}
