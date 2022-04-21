describe('Update first name', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/settings' });
    cy.get('.settings__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get(':nth-child(2) > :nth-child(5) > .svg-inline--fa > path').click();
    cy.get('.input').clear().type('Тест');
    cy.intercept('PATCH', '/api/v1/profile/**').as('updateFirstName');
    cy.get('.setting-card__success-button').click();
    cy.wait('@updateFirstName').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });
    cy.get('.content').contains('Тест');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get(':nth-child(2) > :nth-child(5) > .svg-inline--fa > path').click();
    cy.get('.input').clear().type('Тест');
    cy.intercept('PATCH', '/api/v1/profile/**').as('updateFirstName');
    cy.get('.setting-card__success-button').click();
    cy.wait('@updateFirstName').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });

    cy.get('.content').contains('Тест');
  });
});
