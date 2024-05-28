/* eslint-disable prettier/prettier */
import gql from 'graphql-tag'

export default gql`
  type AuthPayload {
    token: String
    user: User
  }
`
