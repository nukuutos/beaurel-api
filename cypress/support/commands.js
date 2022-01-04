require('cypress-file-upload');

Cypress.Commands.add('auth', (email, password) => {
  cy.visit('/sign-in');

  cy.intercept('/api/v1/auth/**').as('signIn');

  cy.get('form', { timeout: 60000 }).should('be.visible');

  cy.get('#identificator').type(email);
  cy.get('#password').type(password);

  cy.get('.btn--primary').click();
  cy.wait('@signIn');

  cy.get('.profile__header', { timeout: 60000 }).should('be.visible');
});
