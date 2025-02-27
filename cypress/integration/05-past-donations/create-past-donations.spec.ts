describe('Create Past Donations', () => {
  it('should create past donation', () => {

    cy.loginAsAdmin();
    cy.visit(`/donations`);
    cy.intercept('POST', /\/donations\/\d+\/history/).as('storePastDonation');

    cy.findAllByText('Record Donation').first().click();

    const icp = 'test-past-donation-created-icp';
    cy.findByLabelText('ICP').clear();
    cy.findByLabelText('ICP').type(icp);

    cy.findByLabelText('Donation Amount*').clear();
    cy.findByLabelText('Donation Amount*').type('123.45');

    cy.findByLabelText('Account Number*').clear();
    cy.findByLabelText('Account Number*').type('1234560');

    cy.findByText('Save').click();
    cy.wait('@storePastDonation');

    cy.contains(`A donation for ${icp} has been recorded`);
  });

});
