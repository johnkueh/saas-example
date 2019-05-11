import _ from 'lodash';
import dotenv from 'dotenv';
import supertest from 'supertest';
import apolloHandler, { apiPath } from '../index';

dotenv.config();

export const request = async ({ variables, query, headers = {} }) => {
  const { body } = await supertest(apolloHandler)
    .post(apiPath)
    .set(headers)
    .send({
      query,
      variables
    });

  // Debug use only
  if (body.errors) {
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
  }

  return body;
};

export default {
  request
};
