import gql from 'graphql-tag'

export default gql`
  type Mutation {
    login(email: String!, password: String!): User
  }
`
