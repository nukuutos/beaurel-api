require('cypress-file-upload');

Cypress.Commands.add('authVisit', ({ identificator, password, page }) => {
  cy.request('POST', 'http://localhost:5000/api/v1/auth/sign-in', {
    identificator,
    password,
  }).then(() => {
    cy.getCookie('refreshToken').then((data) => {
      cy.visit(page, { headers: { cookie: `refreshToken=${data.value}` } });
    });
  });

  // cy.auth(email, '123456');
  // cy.getCookie('refreshToken').then((data) => {
  //   cy.visit('/messages', { headers: { cookie: `refreshToken=${data.value}` } });
  // });

  //   cy.visit('/sign-in');

  //   cy.intercept('/api/v1/auth/**').as('signIn');

  //   cy.get('#identificator', { timeout: 60000 }).should('be.visible').type(email);
  //   cy.get('#password').type(password);

  //   cy.get('.btn--primary').click();
  //   cy.wait('@signIn');

  //   cy.get('.profile__header', { timeout: 60000 }).should('be.visible');
});
