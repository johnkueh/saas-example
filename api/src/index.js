import { ApolloServer, gql } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';
import jsonwebtoken from 'jsonwebtoken';
import cookie from 'cookie';
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

const initServer = ({ context }) =>
  new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    context
  });

const getUser = (req, secret) => {
  try {
    const { jwt } = cookie.parse(req.headers.cookie || '');
    return jsonwebtoken.verify(jwt, secret);
  } catch (error) {
    return null;
  }
};

const server = initServer({
  context: async ({ req, res }) => {
    const prisma = new Prisma({
      endpoint: process.env.PRISMA_ENDPOINT
    });
    const user = getUser(req, process.env.JWT_SECRET);

    return {
      prisma,
      user,
      req,
      res
    };
  }
});

export const apiPath = '/api/graphql';

export default server.createHandler({ path: apiPath });
