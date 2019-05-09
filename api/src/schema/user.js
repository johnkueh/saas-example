import { gql } from 'apollo-server-micro';
import * as yup from 'yup';
import { rule, shield, and, or, not } from 'graphql-shield';

export default gql`
  extend type Query {
    me: User @requireAuth
  }

  extend type Mutation {
    signup(input: SignupInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    forgotPassword(input: ForgotPasswordInput!): Result
    resetPassword(input: ResetPasswordInput!): Result
    updateUser(input: UpdateUserInput!): User! @requireAuth
    deleteUser: User! @requireAuth
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ForgotPasswordInput {
    email: String!
  }

  input ResetPasswordInput {
    password: String!
    repeatPassword: String!
    token: String!
  }

  input UpdateUserInput {
    name: String
    email: String
    password: String
  }

  type AuthPayload {
    jwt: String!
    user: User!
  }

  type Result {
    message: String
  }

  type User {
    id: String
    name: String
    email: String
    createdAt: DateTime
    updatedAt: DateTime
  }
`;

export const validations = {
  signup: yup.object().shape({
    name: yup
      .string()
      .min(1)
      .max(15),
    email: yup
      .string()
      .email()
      .min(1),
    password: yup.string().min(6)
  }),
  login: yup.object().shape({
    email: yup
      .string()
      .email()
      .min(1),
    password: yup.string().min(6)
  }),
  forgotPassword: yup.object().shape({
    email: yup
      .string()
      .email()
      .min(1)
  }),
  resetPassword: yup.object().shape({
    token: yup.string().required('Password reset token is missing.'),
    password: yup
      .string()
      .required()
      .min(6)
  }),
  updateUser: yup.object().shape({
    name: yup
      .string()
      .min(1)
      .max(15),
    email: yup
      .string()
      .email()
      .min(1),
    password: yup.string().min(6)
  })
};

export const permissions = shield({
  Query: {
    me: true
  }
});
