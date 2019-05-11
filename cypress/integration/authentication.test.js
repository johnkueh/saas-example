import 'cypress-testing-library/add-commands';

describe('logging in errors', () => {
  it('missing fields', () => {
    cy.visit('/login');
    cy.getByPlaceholderText('Password').type('testpassword');
    cy.getByText('Log in').click();
    cy.getByText('Email must be at least 1 characters').should('be.visible');
    cy.getByPlaceholderText('Password').clear();
    cy.getByPlaceholderText('Email address').type('test@example.com');
    cy.getByText('Log in').click();
    cy.getByText('Password must be at least 6 characters').should('be.visible');
  });
  it('wrong credentials', () => {
    cy.visit('/login');
    cy.getByPlaceholderText('Email address').type('test+wrong+user@example.com');
    cy.getByPlaceholderText('Password').type('testpassword');
    cy.getByText('Log in').click();
    cy.getByText('Please check your credentials and try again.').should('be.visible');
  });
});

describe('logging in success', () => {
  beforeEach(() => {
    cy.createUserAndLogin({
      email: 'test+user@example.com',
      password: 'testpassword',
      name: 'Test user'
    });
  });

  it('correct credentials', () => {
    cy.visit('/login');
    cy.getByPlaceholderText('Email address').type('test+user@example.com');
    cy.getByPlaceholderText('Password').type('testpassword');
    cy.getByText('Log in').click();
    cy.url().should('include', '/forms');
  });
});

describe('signup errors', () => {
  it('missing fields', () => {
    cy.prisma({
      deleteManyUsers: {
        email_in: ['email@weirdc.com']
      }
    });
    cy.visit('/signup');
    cy.getByText('Sign up').click();
    cy.getByText('Name must be at least 1 characters').should('be.visible');
    cy.getByText('Email must be at least 1 characters').should('be.visible');
    cy.getByText('Password must be at least 6 characters').should('be.visible');
    cy.getByPlaceholderText('Name').type('Test user');
    cy.getByPlaceholderText('Password').type('testpassword');
    cy.getByPlaceholderText('Email address').type('email@weirdc');
    cy.getByText('Sign up').click();
    cy.getByText('Email must be a valid email').should('be.visible');
  });

  it('email is taken', () => {
    cy.createUser({
      email: 'existing+user@example.com',
      password: 'testpassword',
      name: 'Existing user'
    });

    cy.visit('/signup');
    cy.getByPlaceholderText('Name').type('Test user');
    cy.getByPlaceholderText('Password').type('testpassword');
    cy.getByPlaceholderText('Email address').type('existing+user@example.com');
    cy.getByText('Sign up').click();
    cy.getByText('Email is already taken').should('be.visible');

    cy.prisma({
      deleteManyUsers: {
        email_in: ['existing+user@example.com']
      }
    });
  });
});

describe('signup success', () => {
  it('correct inputs', () => {
    cy.visit('/signup');
    cy.getByPlaceholderText('Email address').type('new+user@example.com');
    cy.getByPlaceholderText('Name').type('New user');
    cy.getByPlaceholderText('Password').type('testpassword');
    cy.getByText('Sign up').click();
    cy.url().should('include', '/forms');

    cy.prisma({
      deleteManyUsers: {
        email_in: ['new+user@example.com']
      }
    });
  });
});
