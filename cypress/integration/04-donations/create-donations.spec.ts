describe('Create Donation', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it('creates a donation', () => {
    cy.visit(`/donations/create`);
    cy.intercept(/(.*)146%20Lichfield%20St%20Christchurch%20NZ(.*)/gm).as(
      'geolocation'
    );
    cy.intercept('POST', /\/donations/).as('storeDonation');

    const icp = 'Backstory ICP';

    cy.findByPlaceholderText('Please Select').type('donor');
    cy.findByText('Cypress Donor').click();
    cy.findByLabelText('ICP').type(icp);
    cy.findByTestId('retailer-select').select('Meridian Energy');
    cy.findByLabelText('Account Number').type('12345678');
    cy.get('#address')
      .type('146 Lichfield St Christchurch NZ')
      .wait('@geolocation');
    cy.wait(200);
    cy.get('#address').type('{enter}');
    cy.get('#gps_coordinates').should('have.value', '-43.5343862,172.6415583');
    cy.findByTestId('donation-amount').type('12.34');

    cy.get('button[type="submit"]').click();
    cy.wait('@storeDonation');

    cy.contains(`Donation ${icp} has been created`);
  });
});
