import { ApolloServer, gql } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';
import jsonwebtoken from 'jsonwebtoken';
import { Prisma } from '../generated/prisma-client';
import typeDefs from './schema';
import resolvers from './resolvers';
import schemaDirectives from './directives';
import { validations } from './middlewares/validations';
import { permissions } from './middlewares/permissions';

const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers, schemaDirectives }),
  ...permissions,
  validations
);

export const initServer = ({ context }) =>
  new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    context
  });

export const getUser = (req, secret) => {
  let user = null;
  try {
    const bearer = req.headers.authorization || '';
    const token = bearer.replace('Bearer ', '');
    user = jsonwebtoken.verify(token, secret);
  } catch (error) {}

  return user;
};

const server = initServer({
  context: async ({ req }) => {
    const prisma = new Prisma({
      endpoint: process.env.PRISMA_ENDPOINT
    });
    const user = getUser(req, process.env.JWT_SECRET);

    return {
      prisma,
      user
    };
  }
});

export default server.createHandler({ path: '/api/graphql' });
