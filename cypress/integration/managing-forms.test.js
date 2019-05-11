import 'cypress-testing-library/add-commands';

describe('creating forms', () => {
  beforeEach(() => {
    cy.createUserAndLogin({
      email: 'test+user@example.com',
      password: 'testpassword',
      name: 'Test user'
    });
  });

  it('fails to create form without a name', () => {
    cy.visit('/forms/new');
    cy.getByText('Create form').click();
    cy.getByText('Name must be at least 1 characters').should('be.visible');
  });

  it('successfully creates form', () => {
    cy.visit('/forms/new');
    cy.getByTestId('new-form-input-name').type('Form 1');
    cy.getByTestId('new-form-submit').click();
  });
});

describe('editing forms', () => {
  beforeEach(() => {
    cy.createUserAndLogin({
      email: 'test+user@example.com',
      password: 'testpassword',
      name: 'Test user'
    });

    cy.prisma({
      deleteManyForms: {
        id_contains: 'test'
      }
    });

    cy.prisma({
      createForm: {
        id: 'test-form',
        name: 'Test form',
        user: {
          connect: {
            email: 'test+user@example.com'
          }
        }
      }
    });
  });

  it('fails to update form without a name', () => {
    cy.visit('/form/edit?id=test-form');
    cy.get('[data-testid="form-input-name"]').clear();
    cy.getByText('Save').click();
    cy.getByText('Name must be at least 1 characters').should('be.visible');
  });

  it('successfully updates and then deletes form', () => {
    cy.visit('/form/edit?id=test-form');
    cy.get('[data-testid="form-input-name"]').type(' additional');
    cy.getByText('Save').click();
    cy.url().should('include', '/form?id=test-form');
    cy.get('[data-testid="form-name"]').should('be', 'Test form additional');
    cy.visit('/form/edit?id=test-form');
    cy.get('[data-testid="delete-form"]').click();
    cy.url().should('include', '/forms');
    cy.get('[data-testid="forms-blank"]').should('exist');
  });
});
