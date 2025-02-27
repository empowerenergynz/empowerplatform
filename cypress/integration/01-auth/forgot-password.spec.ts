describe('Forgot password', () => {
  beforeEach(() => {
    cy.visit(`/forgot-password`);
  });

  it('displays a message when users request a reset password link', () => {
    cy.get("input[name='email']").type('forgot-password@empower.local');

    cy.get('button[type=submit]').click();

    cy.contains(
      'If an account is associated with this email a reset password link will be sent'
    );
  });
});
