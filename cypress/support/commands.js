import { print } from 'graphql';
import gql from 'graphql-tag';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const SIGNUP = gql`
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

Cypress.Commands.add('prisma', params => {
  cy.task('prisma', params);
});

Cypress.Commands.add('deleteUsers', emails => {
  cy.task('prisma', {
    deleteManyUsers: {
      email_in: emails
    }
  });
});

Cypress.Commands.add('createUser', ({ email, name, password }) => {
  cy.request('POST', Cypress.env('apiEndpoint'), {
    query: print(SIGNUP),
    variables: {
      input: {
        email,
        name,
        password
      }
    }
  });
});

Cypress.Commands.add('createUserAndLogin', ({ email, name, password }) => {
  cy.task('prisma', {
    deleteManyUsers: {
      email_in: [email]
    }
  });
  window.localStorage.removeItem('isLoggedIn');
  window.localStorage.removeItem('jwt');
  window.localStorage.removeItem('user');

  cy.request('POST', Cypress.env('apiEndpoint'), {
    query: print(SIGNUP),
    variables: {
      input: {
        email,
        name,
        password
      }
    }
  }).then(res => {
    const {
      body: {
        data: {
          signup: { jwt, user }
        }
      }
    } = res;
    window.localStorage.setItem('isLoggedIn', JSON.stringify(true));
    window.localStorage.setItem('jwt', JSON.stringify(jwt));
    window.localStorage.setItem('user', JSON.stringify(user));
  });
});
