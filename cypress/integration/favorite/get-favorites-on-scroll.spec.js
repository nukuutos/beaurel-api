describe('Get favorites on scroll', () => {
  beforeEach(() => {
    cy.task('db:addMasterWithFavorites');
    cy.task('db:addMasters');
    // go to auth
    cy.auth('test@test.com', '123456');
    // go to search
    cy.get(':nth-child(7) > a').click();
    cy.get('.masters__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get('.master-card').should('have.length', 10);
    cy.intercept('GET', '/api/v1/profile/**').as('getFavorites');
    cy.window().scrollTo('bottom');
    cy.wait('@getFavorites');
    cy.get('.master-card').should('have.length', 16);
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.master-card').should('have.length', 10);
    cy.intercept('GET', '/api/v1/profile/**').as('getFavorites');
    cy.window().scrollTo('bottom');
    cy.wait('@getFavorites');
    cy.get('.master-card').should('have.length', 16);
  });
});
