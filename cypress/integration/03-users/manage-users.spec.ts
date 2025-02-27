describe('User management', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it('creates and edits a user', () => {
    //CREATE USER
    cy.visit(`/users/create`);
    cy.intercept('POST', '/users').as('storeUser');
    cy.intercept('GET', '/users').as('redirect');

    const email = `cypress-test-${Date.now()}@empower.local`;

    cy.findByLabelText('First name*').type('Cypress');
    cy.findByLabelText('Last name').type('Test');
    cy.findByLabelText('Phone number').type('+6433719454');
    cy.findByLabelText('Email address*').type(email);
    cy.get('button[data-testid="select-roles"]').click();
    cy.get('[type="checkbox"]').last().check({ force: true });
    cy.get('button[aria-label=Close]').last().click({ force: true });
    cy.contains('Donor');

    cy.get('button[type=submit]').click();

    cy.contains(`Invitation sent to ${email}`);
    cy.closeToast();

    //EDIT USER
    cy.visit('/users');
    cy.get('[data-testid="users-list"]').within(($list) => {
      cy.wrap($list).findByText('Cypress User-to-edit').click();
    });
    cy.findByText('Edit').click();
    // note lowercase - this is transformed to uppercase using CSS
    cy.get('[data-testid="select-roles"]').should('have.text', 'donor');

    cy.findByLabelText('Last name').clear().type('Updated user');

    cy.get('button[type=submit]').click();

    cy.contains(`cypress-user-to-edit@empower.local has been updated`);

    cy.contains('Cypress Updated user').should('be.visible');

    //ROLE PICKER DISABLING CHECK
    cy.visit('/users');
    cy.get('[data-testid="users-list"]').within(($list) => {
      cy.wrap($list).findByText('Cypress Test').click();
    });
    cy.findByText('Edit').click();
    //Following test - Role Donor once selected/checked, SuperAdmin should be disabled.
    cy.get('button[data-testid="select-roles"]').click();
    cy.get('[type="checkbox"]').last().check({ force: true });
    cy.get('[type="checkbox"]').first().should('be.disabled');

    cy.get('button[type=submit]').click();

    cy.contains(`${email} has been updated`);

    cy.visit('/users');
    cy.get('[data-testid="users-list"]').within(($list) => {
      cy.wrap($list).contains('Cypress Updated user').should('be.visible');
    });
  });
});
