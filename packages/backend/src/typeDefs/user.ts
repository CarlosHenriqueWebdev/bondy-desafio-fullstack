import gql from 'graphql-tag'

export default gql`
  type User {
    name: String
    email: String
    company: String
  }
`
