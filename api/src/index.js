import { ApolloServer, gql } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';
import jsonwebtoken from 'jsonwebtoken';
import { prisma } from '../generated/prisma-client';
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

const server = new ApolloServer({
  schema,
  introspection: true,
  playground: true,
  context: async ({ req }) => {
    let user = {};
    try {
      const bearer = req.headers.authorization || '';
      const token = bearer.replace('Bearer ', '');
      user = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    } catch (error) {}

    return {
      prisma,
      user
    };
  }
});

export default server.createHandler({ path: '/api/graphql' });
