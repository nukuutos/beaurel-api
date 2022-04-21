describe('Get favorites on scroll', () => {
  beforeEach(() => {
    cy.task('db:addMasterWithFavorites');
    cy.task('db:addMasters');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/masters' });
    cy.get('.masters__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get('.master-card').should('have.length', 10);
    cy.intercept('GET', '/api/v1/profile/**').as('getFavorites');
    cy.window().scrollTo('bottom');
    cy.wait('@getFavorites');
    cy.get('.master-card').should('have.length', 20);
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.master-card').should('have.length', 10);
    cy.intercept('GET', '/api/v1/profile/**').as('getFavorites');
    cy.window().scrollTo('bottom');
    cy.wait('@getFavorites');
    cy.get('.master-card').should('have.length', 20);
  });
});
