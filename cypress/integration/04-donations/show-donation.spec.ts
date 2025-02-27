describe('Show Donation', () => {
  beforeEach(() => {
    cy.loginAsAdmin();

    cy.intercept(/^\/donations.+/).as('getDonation');
  });

  it('should show a donation', () => {
    cy.visit(`/donations`);

    cy.findByText('1234561').click().wait('@getDonation');

    cy.findAllByText('cypress-donation-1').should('have.length', 2);
    cy.findByText('Donation Address 1').should('be.visible');
    cy.findByText('31,80').should('be.visible');
  });
});
