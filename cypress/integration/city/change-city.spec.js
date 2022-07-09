describe('Change city', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.visit('/sign-in');
    cy.get('form', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    const city = 'Абакан';

    cy.get('#identificator', { timeout: 60000 }).should('be.visible');

    cy.intercept('/api/v1/**').as('getCities');
    cy.get('.city').click();
    cy.wait('@getCities');

    cy.get('.city-search > :nth-child(5)').click();
    cy.get('.current-city__value').contains(city);
    cy.get('.modal__close').click();
    cy.viewport(1210, 500);
    cy.get('.city').contains(city);
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    const city = 'Абакан';

    cy.get('#identificator', { timeout: 60000 }).should('be.visible');

    cy.intercept('/api/v1/**').as('getCities');
    cy.get('.mobile-navbar__item--menu').click();
    cy.wait('@getCities');

    cy.get('.city-search > :nth-child(5)').click();
    cy.get('.current-city__value').contains(city);
    cy.get('.back-bar__icon').click();
    cy.viewport(1210, 500);
    cy.get('.city').contains(city);
  });
});
