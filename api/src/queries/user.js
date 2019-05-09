export const ME = `
  query {
    me {
      name
      email
    }
  }
`;

export const SIGNUP = `
mutation($input: SignupInput!) {
  signup(input: $input) {
    jwt
    user {
      name
      email
    }
  }
}
`;

export const LOGIN = `
mutation($input: LoginInput!) {
  login(input: $input) {
    jwt
    user {
      name
      email
    }
  }
}
`;

export const UPDATE_USER = `
mutation($input: UpdateUserInput!) {
  updateUser(input: $input) {
    name
    email
  }
}
`;

export const FORGOT_PASSWORD = `
mutation($input: ForgotPasswordInput!) {
  forgotPassword(input: $input) {
    message
  }
}
`;

export const RESET_PASSWORD = `
mutation($input: ResetPasswordInput!) {
  resetPassword(input: $input) {
    message
  }
}
`;

export const DELETE_USER = `
mutation {
  deleteUser {
    id
  }
}
`;
