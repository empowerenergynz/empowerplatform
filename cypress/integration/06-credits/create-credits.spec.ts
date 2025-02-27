describe('Create Credits', () => {
  it('should create credits', () => {
    cy.loginAsAgencyUser();
    cy.visit(`/credits/create`);
    cy.intercept('POST', /\/credits/).as('storeCredit');

    cy.findByLabelText('Client Name*').type('Bob Client');
    cy.findByLabelText('Account Number*')
      .type('123456abc')
      .should('have.value', '123456');
    cy.findByLabelText('Retailer*').select('Mercury');
    cy.findByLabelText('Region*').select('Canterbury');
    cy.findByLabelText('District*').select('Selwyn District');
    cy.findByText('Custom').click();
    cy.findByTestId('amount')
      .type('1ab2.3ab')
      .should('have.value', '123');
    cy.findByLabelText('Notes*').type('a custom value');

    cy.findByText('Create Allocation').click();
    cy.wait('@storeCredit');

    cy.contains(`Credit for Bob Client has been created`);

    // test the form is reset
    cy.findByLabelText('Client Name*').should('have.value', '');
  });

});
