describe('Users', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit(`/users`);

    cy.intercept(/^\/users\?filter.+/).as('fetchFilteredUsers');
  });

  it('should show users', () => {
    cy.get('[data-testid="page-title"]').should('contain.text', 'Users');
    cy.get('[data-testid="users-list"] > div')
      .its('length')
      .should('be.gte', 6);
  });

  it('should resend invites', () => {
    cy.get('[data-testid="users-list"]').within(($list) => {
      cy.wrap($list)
        .findByText('Resend Invite User')
        .parent()
        .parent()
        .parent()
        .findByRole('button', { name: 'Resend' })
        .click();
    });

    cy.contains(`Invitation resent to resend_invite_user@empower.local`);
  });

  it('should filter users', () => {
    cy.findByLabelText('Search users').type('cypress-donor');
    cy.wait('@fetchFilteredUsers').then(() => {
      cy.wait(10); // sometimes the Skeleton loader is still visible
      cy.get('[data-testid="users-list"] > div')
        .its('length')
        .should('be.eq', 1);
    });
  });

  it('should filter users by role', () => {
    cy.contains('Roles')
      .click()
      .get('[type="checkbox"]')
      .first()
      .check({ force: true });
    cy.wait('@fetchFilteredUsers').then(() => {
      cy.wait(10); // sometimes the Skeleton loader is still visible
      cy.get('[data-testid="users-list"] > div')
        .its('length')
        .should('be.equal', 1);
    });
  });

  it('should filter users by status', () => {
    cy.get('#user-status-filter').select('Invited');
    cy.wait('@fetchFilteredUsers').then(() => {
      cy.get('[data-testid="users-list"] > div')
        .its('length')
        .should('be.gte', 2);
    });
  });
});
