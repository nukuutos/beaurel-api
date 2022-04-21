describe('Get favorites on scroll', () => {
  beforeEach(() => {
    cy.task('db:addMasterWithFavorites');
    cy.task('db:addMasters');
    cy.authVisit({ identificator: 'test', password: '123456', page: '/messages' });
    cy.get('.content').contains('Сообщения');
  });

  it('Desktop', () => {
    cy.intercept('GET', '/api/v1/profile/**').as('getFavorites0');
    cy.get('.messages__new-dialog-icon').click();
    cy.wait('@getFavorites0');

    cy.get('.favorite-master').should('have.length', 10);

    cy.intercept('GET', '/api/v1/profile/**').as('getFavorites1');
    cy.get('.messages__favorite-masters > :nth-child(10)').scrollIntoView();
    cy.wait('@getFavorites1');

    cy.get('.favorite-master').should('have.length', 20);
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/profile/**').as('getFavorites0');
    cy.get('.messages__new-dialog-icon').click();
    cy.wait('@getFavorites0');

    cy.get('.favorite-master').should('have.length', 10);

    cy.intercept('GET', '/api/v1/profile/**').as('getFavorites1');
    cy.get('.messages__favorite-masters > :nth-child(10)').scrollIntoView();
    cy.wait('@getFavorites1');

    cy.get('.favorite-master').should('have.length', 20);
  });
});
