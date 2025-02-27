describe('Layout', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit(`/users`);
  });

  it('should show fixed sidebar, footer and no header on Desktop', () => {
    cy.findByTestId('sidebar').should('be.visible');
    cy.get('[aria-label="open menu"]').should('not.be.visible');
    cy.get('footer').should('be.visible');
  });

  it('should show temporary sidebar, header but no footer on Mobile', () => {
    cy.viewport('iphone-6');
    cy.get('footer').should('not.be.visible');
    cy.get('[data-testid="sidebar"]').should('not.be.visible');
    cy.get('[aria-label="open menu"]').should('be.visible').click();
    cy.get('[data-testid="sidebar"]').should('be.visible')
    cy.get('[data-testid="close-sidebar"]').last().should('be.visible').click();
    cy.get('[data-testid="sidebar"]').should('not.be.visible');
  });
});
