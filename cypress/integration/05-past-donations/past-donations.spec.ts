describe('Past Donations', () => {
  it('should show past donations for logged in donor', () => {
    cy.loginAsDonor();
    cy.visit(`/history`);

    cy.findByTestId('page-title').should('have.text', 'History');

    cy.findAllByText('cypress-donation-0').should('have.length', 3);
    // this is the past donation created in create-past-donations.spec.ts
    cy.findAllByText('test-past-donation-created-icp').should('have.length', 1);
    cy.findAllByText('$123.45').should('have.length', 1);
    cy.findAllByText('1234560').should('have.length', 4);

    // check we don't see the other donor's history
    cy.findAllByText('cypress-donation-1').should('have.length', 0);
  });

  it('should show admin past donations for selected donor', () => {
    cy.loginAsAdmin();
    cy.visit(`/users`);
    cy.intercept(/^\/users\/.+\/history/).as('getUserHistory');

    cy.findByText('Cypress Donor').click();

    cy.findByText('History').click().wait('@getUserHistory');

    cy.findByText('DONATION HISTORY').should('be.visible');

    cy.findAllByText('cypress-donation-0').should('have.length', 3);
    // this is the past donation created in create-past-donations.spec.ts
    cy.findAllByText('test-past-donation-created-icp').should('have.length', 1);
    cy.findAllByText('$123.45').should('have.length', 1);
    cy.findAllByText('1234560').should('have.length', 4);

    // check we don't see the other donor's history
    cy.findAllByText('cypress-donation-1').should('have.length', 0);
  });
});
