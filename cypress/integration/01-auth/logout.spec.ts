describe('Log out', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it('redirects the user to login page when they log out successfully', () => {
    cy.visit(`/`);
    cy.get('[data-testid="logout"]')
      .click()
      .then(() => {
        cy.contains('Log in').should('be.visible');
      });
  });
});
