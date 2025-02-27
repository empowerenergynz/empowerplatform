describe('Log in', () => {
  beforeEach(() => {
    cy.visit(`/login`);
  });

  it('redirects the user to home when they log in successfully', () => {
    cy.get("input[name='email']")
      .type('cypress-admin@empower.local')
      .get("input[name='password']")
      .type('password');
    cy.contains('Log in')
      .click()
      .get('[data-testid="user-name"]')
      .should('have.text', 'Cypress Admin');
  });
});
