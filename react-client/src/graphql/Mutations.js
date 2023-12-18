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

