import '@testing-library/cypress/add-commands';

import 'cypress-file-upload';
import Chainable = Cypress.Chainable;

const login = (email: string, password: string): Chainable<JQuery> => {
  cy.visit(`/login`);

  return cy.getCookie('XSRF-TOKEN').then((cookie) => {
    const xsrf = cookie?.value.replace('%3D', '');

    return cy
      .request({
        method: 'POST',
        url: '/login',
        form: true,
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'X-XSRF-TOKEN': xsrf,
        },
        body: {
          email,
          password,
        },
      })
      .then((response) => {
        return cy.wrap(response.body);
      });
  });
};

Cypress.Commands.add('loginAsDonor', () => {
  const email = 'cypress-donor@empower.local';
  const password = 'password';

  return login(email, password);
});

Cypress.Commands.add('loginAsAdmin', () => {
  const email = 'cypress-admin@empower.local';
  const password = 'password';

  return login(email, password);
});

Cypress.Commands.add('loginAsSuperAdmin', () => {
  const email = 'cypress-super-admin@empower.local';
  const password = 'password';

  return login(email, password);
});

Cypress.Commands.add('loginAsAgencyAdmin', () => {
  const email = 'cypress-agency-admin@empower.local';
  const password = 'password';

  return login(email, password);
});

Cypress.Commands.add('loginAsAgencyUser', () => {
  const email = 'cypress-agency-user@empower.local';
  const password = 'password';

  return login(email, password);
});

Cypress.Commands.add('closeToast', () => {
  cy.get('.chakra-toast').find('button[aria-label="Close"]').last().click();
});
