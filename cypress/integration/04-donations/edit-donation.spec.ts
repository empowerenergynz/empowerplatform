describe('Edit Donations', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.intercept(/^\/donations\/[0-9]*/).as('getDonation');
    cy.intercept(/^\/donations\/[^/]+\/edit/).as('editDonation');
  });

  it('edits a donation', () => {
    cy.visit(`/donations`);

    cy.get('[data-testid="donations-list"] > a')
      .first()
      .click()
      .wait('@getDonation');

    cy.findByText('Edit').click().wait('@editDonation');

    cy.get('[data-testid="create-donation-form"]');
    cy.findByLabelText('ICP').clear().type('Updated ICP');

    cy.get('button[type=submit]').click().wait('@getDonation');

    cy.contains('Updated ICP has been updated');
    cy.findByRole('heading', { name: 'Updated ICP' }).should('be.visible');
  });
});
