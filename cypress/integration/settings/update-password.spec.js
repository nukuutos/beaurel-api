describe('Update username', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/settings' });
    cy.get('.settings__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get(':nth-child(4) > .setting-card__change-password').click();
    cy.get('#password').type('123456');
    cy.get('#newPassword').type('1234567');
    cy.get('#newConfirmedPassword').type('1234567');
    cy.intercept('PUT', '/api/v1/profile/**').as('updatePassword');
    cy.get('.update-password__form > .btn').click();
    cy.wait('@updatePassword').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });
    cy.get('.update-password').should('not.exist');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get(':nth-child(4) > .setting-card__change-password').click();
    cy.get('#password').type('123456');
    cy.get('#newPassword').type('1234567');
    cy.get('#newConfirmedPassword').type('1234567');
    cy.intercept('PUT', '/api/v1/profile/**').as('updatePassword');
    cy.get('.update-password__form > .btn').click();
    cy.wait('@updatePassword').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });
    cy.get('.update-password').should('not.exist');
  });
});
