describe('Change city on scroll', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.visit('/sign-in');
    cy.get('form', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    const city = 'Азов';

    cy.get('#identificator', { timeout: 60000 }).should('be.visible');

    cy.intercept('/api/v1/**').as('getCities');
    cy.get('.city').click();
    cy.wait('@getCities');

    cy.get('.city-search__city').should('have.length', 10);

    cy.intercept('/api/v1/**').as('getCities1');
    cy.get('.city-search > :nth-child(9)').scrollIntoView();
    cy.wait('@getCities1');

    cy.get('.city-search__city').should('have.length', 20);

    cy.get('.city-search > :nth-child(12)').click();

    cy.get('.current-city__value').contains(city);
    cy.get('.fa-times > path').click();
    cy.viewport(1210, 500);
    cy.get('.city').contains(city);
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    const city = 'Азов';

    cy.get('#identificator', { timeout: 60000 }).should('be.visible');

    cy.intercept('/api/v1/**').as('getCities');
    cy.get('.mobile-navbar__item--menu').click();
    cy.wait('@getCities');

    cy.get('.city-search__city').should('have.length', 10);

    cy.intercept('/api/v1/**').as('getCities1');
    cy.get('.city-search > :nth-child(9)').scrollIntoView();
    cy.wait('@getCities1');

    cy.get('.city-search__city').should('have.length', 20);

    cy.get('.city-search > :nth-child(12)').click();

    cy.get('.current-city__value').contains(city);
    cy.get('.back-bar__main > .svg-inline--fa > path').click();
    cy.viewport(1210, 500);
    cy.get('.city').contains(city);
  });
});
