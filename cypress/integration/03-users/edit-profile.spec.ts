describe('Edit Profile', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it('edits profile', () => {
    cy.visit(`/profile`);
    cy.intercept('PUT', '/profile').as('updateProfile');

    cy.findByLabelText('Phone number').clear().type('+6402233233721');

    cy.get('button[type=submit]').click();
    cy.wait('@updateProfile');

    cy.contains('Your profile has been updated');
  });
});
