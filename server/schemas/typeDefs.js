const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Book {
    _id: ID!
    authors: [String!]
    desciption: String!
    bookId: String!
    image: String
    link: String
    title: String!
}

input BookInput {
    authors: [String!]
    desciption: String!
    bookId: String!
    image: String
    link: String
    title: String!
}

type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
}

type Query {
    book: [Book]
    user: [User]
    me: User
}

type Auth {
    token: ID!
    user: [User]
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    removeBook(bookId: String!): User
    saveBook(input: BookInput): User
}
`;


module.exports = typeDefs;