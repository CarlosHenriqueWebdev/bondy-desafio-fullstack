import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled'
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from '@as-integrations/aws-lambda'
import { buildSubgraphSchema } from '@apollo/subgraph'
import typeDefs from '../typeDefs/index'
import { connection } from '../memoryDB/connection'
import resolvers from './resolvers/index'
import jwt from 'jsonwebtoken'
import { User } from 'src/models/User'
import { Blacklist } from 'src/models/Blacklist'

const { NODE_ENV = 'local' } = process.env

// Build the schema
const schema = buildSubgraphSchema({ typeDefs, resolvers })

const requestHandler = handlers.createAPIGatewayProxyEventRequestHandler()

const apolloServer = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginInlineTraceDisabled()],
  includeStacktraceInErrorResponses: true,
  status400ForVariableCoercionErrors: true,
  introspection: true,
})

const buildContext = startServerAndCreateLambdaHandler(
  apolloServer,
  requestHandler,
  {
    context: async ({ event, context }) => {
      context.callbackWaitsForEmptyEventLoop = false
      console.log(`Connected in ${NODE_ENV} environment`)
      await connection()

      let user = null
      const authHeader = event.headers.Authorization || ''
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '')
        try {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
          // Check if the token is in the blacklist
          const isBlacklisted = await Blacklist.findOne({ token })
          if (!isBlacklisted) {
            user = await User.findById(decodedToken.userId)
          }
        } catch (err) {
          console.error('Failed to authenticate token', err)
        }
      }

      return {
        headers: event.headers,
        functionName: context.functionName,
        event,
        context,
        user,
      }
    },
  }
)

export default buildContext
