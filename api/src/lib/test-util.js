import _ from 'lodash';
import dotenv from 'dotenv';
import request from 'supertest';
import { get, post, options, router } from 'microrouter';
import { Prisma } from '../../generated/prisma-client';
import { initServer, getUser } from '../index';

dotenv.config();

const apiPath = '/api/graphql';

export const prisma = new Prisma({
  endpoint: process.env.PRISMA_ENDPOINT
});

const server = initServer({
  context: async ({ req }) => {
    const user = getUser(req, process.env.JWT_SECRET);

    return {
      prisma,
      user
    };
  }
});

const apolloHandler = server.createHandler({ path: apiPath });

export const graphqlRequest = async ({ variables, query, headers = {} }) => {
  const { body } = await request(app)
    .post(apiPath)
    .set(headers)
    .send({
      query,
      variables
    });

  // Debug use only
  if (body.errors) debugErrors(body);

  return body;
};

export const debugErrors = body => {
  _.map(body.errors, error => {
    switch (error.extensions.code) {
      case 'BAD_USER_INPUT':
        return null;
      case 'UNAUTHENTICATED':
        return null;
      default:
        return console.log(`❌  ${error.extensions.code}`, error);
    }
  });
};

const app = router(
  options(apiPath, apolloHandler),
  post(apiPath, apolloHandler),
  get(apiPath, apolloHandler)
);

export default {
  graphqlRequest
};
