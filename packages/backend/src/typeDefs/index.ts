import gql from 'graphql-tag'
import query from './query'
import mutation from './mutation'
import user from './user'
import authPayload from './authPayload'

// Manually combine the type definitions
const typeDefs = gql`
  ${query}
  ${mutation}
  ${user}
  ${authPayload}
`

export default typeDefs
