describe('Update username', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/settings' });
    cy.get('.settings__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get('.content > :nth-child(2) > :nth-child(3)').click();
    cy.get('.input').clear().type('testik');
    cy.intercept('PUT', '/api/v1/profile/**').as('updateUsername');
    cy.get('.setting-card__success-button').click();
    cy.wait('@updateUsername').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });
    cy.get('.content').contains('test');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.content > :nth-child(2) > :nth-child(3)').click();
    cy.get('.input').clear().type('testik');
    cy.intercept('PUT', '/api/v1/profile/**').as('updateUsername');
    cy.get('.setting-card__success-button').click();
    cy.wait('@updateUsername').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });
    cy.get('.content').contains('test');
  });
});
