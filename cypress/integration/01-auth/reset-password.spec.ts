describe('Reset User Password', () => {
  it('resets passwords', () => {
    cy.visit(
      `/reset-password/cypress_reset_password_token?email=cypress-reset-password%40empower.local`
    );

    cy.findByLabelText('Password').type('my_secure_password');
    cy.findByLabelText('Password Confirmation').type('my_secure_password');

    cy.get('button[type=submit]').click();

    cy.contains('Your password has been updated');
  });
});
