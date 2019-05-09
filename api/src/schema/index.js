import { gql } from 'apollo-server-micro';

import userSchema, { validations as userValidations } from './user';
import formSchema, { validations as formValidations } from './form';
import logoSchema from './logo';

const linkSchema = gql`
  scalar DateTime

  directive @requireAuth on FIELD_DEFINITION
  directive @computed(value: String) on FIELD_DEFINITION

  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  # type Subscription {
  #   _: Boolean
  # }
`;

export default [linkSchema, userSchema, formSchema, logoSchema];

export const validationSchema = {
  ...userValidations,
  ...formValidations
};
