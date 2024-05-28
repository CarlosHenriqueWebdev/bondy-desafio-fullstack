/* eslint-disable prettier/prettier */
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from '@as-integrations/aws-lambda';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { NODE_ENV = 'local' } = process.env;
const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

// Define the GraphQL schema
const typeDefs = gql`
  type User {
    name: String
    email: String
    company: String
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    logout: Boolean
  }

  type Query {
    queryTest: Boolean
  }
`;

// Define the User model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  password: { type: String, required: true },
});

const User = mongoose.model('user', UserSchema);

// Define the Token Blacklist model
const BlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const Blacklist = mongoose.model('blacklist', BlacklistSchema);

// MongoDB connection function
const connection = async () => {
  const connState = mongoose.connection.readyState;
  if (connState.valueOf() !== 1) {
    await mongoose.connect(
      'mongodb+srv://test:99mM35scnc@test.5wrvlov.mongodb.net/test?retryWrites=true&w=majority',
      { dbName: 'test' }
    );
    console.log("Connected to MongoDB Atlas Database");

    // Ensure the test user is created
    const userMock = {
      name: 'Usuário teste',
      email: 'desafio@bondy.com.br',
      company: 'Desafio Bondy',
    };
    const userPassword = await bcrypt.hash('123456', 8);
    await User.findOneAndUpdate(
      { email: userMock.email },
      { ...userMock, password: userPassword },
      { upsert: true }
    );
  }
};

// Define the resolvers
const resolvers = {
  Query: {
    queryTest: (_parent, _args, context) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }
      return true;
    },
  },
  Mutation: {
    login: async (_parent, args, _context) => {
      // Find the user by email
      const user = await User.findOne({ email: args.email });
      if (!user) {
        throw new Error('User not found');
      }

      // Verify the password
      const isValid = await bcrypt.compare(args.password, user.password);
      if (!isValid) {
        throw new Error('Invalid password');
      }

      // Generate JWT
      const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '3d' });

      // Return user information and token
      console.log('Generated token:', token);
      return {
        token,
        user: {
          name: user.name,
          email: user.email,
          company: user.company
        }
      };
    },
    logout: async (_parent, _args, context) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }
      const authHeader = context.headers.Authorization || '';
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const expiresAt = jwt.decode(token).exp * 1000;
        await Blacklist.create({ token, expiresAt });
      }
      return true;
    },
  },
};

// Build the schema
const schema = buildSubgraphSchema({ typeDefs, resolvers });

const requestHandler = handlers.createAPIGatewayProxyEventRequestHandler();

const apolloServer = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginInlineTraceDisabled()],
  includeStacktraceInErrorResponses: true,
  status400ForVariableCoercionErrors: true,
  introspection: true,
});

const buildContext = startServerAndCreateLambdaHandler(
  apolloServer,
  requestHandler,
  {
    context: async ({ event, context }) => {
      context.callbackWaitsForEmptyEventLoop = false;
      console.log(`Connected in ${NODE_ENV} environment`);
      await connection();

      let user = null;
      const authHeader = event.headers.Authorization || '';
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        console.log('Received token:', token);
        try {
          const decodedToken = jwt.verify(token, JWT_SECRET);
          // Check if the token is in the blacklist
          const isBlacklisted = await Blacklist.findOne({ token });
          if (!isBlacklisted) {
            user = await User.findById(decodedToken.userId);
          }
        } catch (err) {
          console.error('Failed to authenticate token', err);
        }
      }

      return {
        headers: event.headers,
        functionName: context.functionName,
        event,
        context,
        user,
      };
    },
  }
);

export default buildContext;
