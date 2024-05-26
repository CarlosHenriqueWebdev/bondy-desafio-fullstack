import { GraphQLResolveInfo } from 'graphql'
import { login } from './login'

export default {
  login: async (
    parent: any,
    args: { email: string; password: string },
    context: any,
    info: GraphQLResolveInfo
  ) => login(parent, args, context, info),
}
