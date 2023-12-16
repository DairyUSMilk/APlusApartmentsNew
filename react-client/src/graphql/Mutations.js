import { gql } from "@apollo/client";

export function createUser(id, email, name, dateOfBirth, gender, accountType) {
    return gql`
    mutation AddUser {
    addUser(
        _id: "${id}"
        email: "${email}"
        name: "${name}"
        dateOfBirth: "${dateOfBirth}"
        gender: "${gender}"
        accountType: "${accountType}"
        ) {
        _id
        name
        dateOfBirth
        gender
    }
    `;
}

/*(
        $id: String!,
        $email: String!,
        $name: String!,
        dateOfBirth: String!,
        gender: String!,
        accountType: String!
        )
        */