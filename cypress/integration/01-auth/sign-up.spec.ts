describe('Sign Up User', () => {
  it('sets up user account', () => {
    cy.visit(`/sign-up/cypress_invitation_token`);

    cy.get('[data-testid="welcome-form"]').should(
      'have.text',
      'Welcome Invited User'
    );

    cy.findByLabelText('Password').type('my_secure_password');
    cy.findByLabelText('Password Confirmation').type('my_secure_password');

    cy.get('button[type=submit]')
      .click()
      .get('[data-testid="user-name"]')
      .should('have.text', 'Invited User');
  });
});
