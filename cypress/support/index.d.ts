declare namespace Cypress {
  interface Chainable {
    loginAsDonor(): Chainable<JQuery>;
    loginAsAdmin(): Chainable<JQuery>;
    loginAsSuperAdmin(): Chainable<JQuery>;
    loginAsAgencyUser(): Chainable<JQuery>;
    loginAsAgencyAdmin(): Chainable<JQuery>;
    closeToast(): Chainable<JQuery>;
  }
}
