describe('Donations', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit(`/donations`);
    cy.intercept(/^\/donations\?sort.+/).as(
      'sortDonations'
    );
  });

  it('should show donations', () => {
    cy.get('[data-testid="page-title"]').should('contain.text', 'Donations');
    cy.get('[data-testid="donations-list"] > a')
      .its('length')
      .should('be.gte', 3);
  });

  it('should sort donations by name', () => {
    cy.get('[data-testid="donor-name"]').then(($els) => {
      const names = Cypress._.map($els, 'innerText');
      const expectedSortedNames = [...names].sort();

      // default is already sorted
      expect(names).to.deep.eq(expectedSortedNames);

      // first click should be same sort order
      cy.get('[data-testid="sort-donor"]').click();
      cy.wait('@sortDonations');

      cy.get('[data-testid="donor-name"]').then(($els) => {
        const sortedNames = Cypress._.map($els, 'innerText');
        expect(sortedNames).to.deep.eq(expectedSortedNames);
      });

      // second click should be reverse sorted
      cy.get('[data-testid="sort-donor"]').click();
      cy.wait('@sortDonations');

      cy.get('[data-testid="donor-name"]').then(($els) => {
        const sortedNames = Cypress._.map($els, 'innerText');
        expect(sortedNames).to.deep.eq(expectedSortedNames.reverse());
      });
    });
  });

  it('should sort donations by amount', () => {
    cy.get('[data-testid="donor-amount"]').then(($els) => {
      const amounts = Cypress._.map($els, 'innerText').map(s => parseFloat(s.replace(/[$%]/, '')));
      const expectedSortedAmounts = [...amounts].sort((a, b) => a - b);

      // first click should be same sorted ascending
      cy.get('[data-testid="sort-amount"]').click();
      cy.wait('@sortDonations');

      cy.get('[data-testid="donor-amount"]').then(($els) => {
        const sortedAmounts = Cypress._.map($els, 'innerText').map(s => parseFloat(s.replace(/[$%]/, '')));
        expect(sortedAmounts).to.deep.eq(expectedSortedAmounts);
      });

      // second click should be reverse sorted
      cy.get('[data-testid="sort-amount"]').click();
      cy.wait('@sortDonations');

      cy.get('[data-testid="donor-amount"]').then(($els) => {
        const sortedAmounts = Cypress._.map($els, 'innerText').map(s => parseFloat(s.replace(/[$%]/, '')));
        expect(sortedAmounts).to.deep.eq(expectedSortedAmounts.reverse());
      });
    });
  });
});
