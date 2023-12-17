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


/*

export function createUser(accountType) {
    let ADD_RENTER = gql`
    mutation AddRenter(
        $uid: String!,
        $email: String!
        $name: String!
        $dateOfBirth: String!
        $gender: String!
        $accountType: String!
    ) {
    addRenter(
        uid: $uid
        email: $email
        name: $name
        dateOfBirth: $dateOfBirth
        gender: $gender
        accountType:"$accountType
        ) {
        _id
        name
        dateOfBirth
        gender
    }
    }
    `;

    if (accountType === 'landlord') {
        ADD_RENTER = gql`
        mutation AddLandlord(
            $uid: String!,
            $email: String!
            $name: String!
            $dateOfBirth: String!
            $gender: String!
            $accountType: String!
        ) {
        addLandlord(
            uid: $uid
            email: $email
            name: $name
            dateOfBirth: $dateOfBirth
            gender: $gender
            accountType:"$accountType
            ) {
            _id
            name
            contactInfo
        }
        }
        `;
    }

    return ADD_RENTER;
}






(
        $id: String!,
        $email: String!,
        $name: String!,
        dateOfBirth: String!,
        gender: String!,
        accountType: String!
        )
        */