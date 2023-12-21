import { gql } from "@apollo/client";

export function createRenter() {
    return gql`
    mutation AddRenter(
        $id: String!,
        $email: String!,
        $name: String!,
        $dateOfBirth: String!,
        $gender: String!,
        $city: String!,
        $state: String!,
    ) {
    addRenter(
        id: $id
        email: $email
        name: $name
        dateOfBirth: $dateOfBirth
        gender: $gender
        city: $city
        state: $state
        ) {
        id
        name
        dateOfBirth
        gender
    }
    }
    `;
}

export function editRenter() {
    return gql`
    mutation Mutation($id: String!, $name: String, $dateOfBirth: String, $gender: String) {
        editRenter(id: $id, name: $name, dateOfBirth: $dateOfBirth, gender: $gender) {
          id
          name
          gender
          dateOfBirth
        }
      }
    `
}

export function editLandlord() {
    return gql`
    mutation Mutation($id: String!, $name: String, $contactInfo: String) {
        editLandlord(id: $id, name: $name, contactInfo: $contactInfo) {
          id
          name
          contactInfo
        }
      }
    `
}

export function createLandlord() {
    return gql`
    mutation AddLandlord(
        $id: String!,
        $email: String!,
        $name: String!,
        $dateOfBirth: String!,
        $gender: String!,
        $city: String!,
        $state: String!,
    ) {
    addLandlord(
        id: $id
        email: $email
        name: $name
        dateOfBirth: $dateOfBirth
        gender: $gender
        city: $city
        state: $state
        ) {
        id
        name
        contactInfo
    }
    }
    `;
}

export function createAdmin() {
    return gql`
    mutation AddAdmin(
        $id: String!,
        $email: String!,
        $name: String!,
        $dateOfBirth: String!,
        $gender: String!,
        $city: String!,
        $state: String!,
    ) {
    addAdmin(
        id: $id
        email: $email
        name: $name
        dateOfBirth: $dateOfBirth
        gender: $gender
        city: $city
        state: $state
        ) {
        id
        name
    }
    }
    `;
}

export function createApartment() {
    return gql`
    mutation AddApartment(
        $name: String!,
        $address: String!, 
        $city: String!,
        $state: String!,
        $price: Float!, 
        $amenities: [String]!,
        $landlordId: String!,
        $description: String) {
        addApartment(
            name: $name
            address: $address,
            city: $city,
            state: $state, 
            price: $price, 
            amenities: $amenities,
            landlordId: $landlordId, 
            description: $description) {
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
        }
      }
    `;
}

export function deleteApartment() {
    return gql`
    mutation RemoveApartment($id: String!) {
    removeApartment(id: $id) {
        id
    }
    }
    `;
}

export function approveApartment() {
    return gql`
    mutation ApproveApartment($id: String!) {
        approveApartment(id: $id) {
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
        $rating: Int!,
        $content: String!, 
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

export function addApartmentToBookmark() {
    return gql`
    mutation AddBookmark($userId: String!, $apartmentId: String!) {
        addBookmark(userId: $userId, apartmentId: $apartmentId)
    }
    `;
}

export function removeApartmentFromBookmark() {
    return gql`
    mutation RemoveBookmark($userId: String!, $apartmentId: String!) {
        removeBookmark(userId: $userId, apartmentId: $apartmentId)
    }
    `;
}


