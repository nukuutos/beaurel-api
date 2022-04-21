describe('Update city as customer', () => {
  beforeEach(() => {
    cy.task('db:addCustomer');
    // go to auth
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/test1' });
    cy.get('.profile__identity', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    const city = 'Абакан';

    // city
    cy.intercept('/api/v1/**').as('getCities');
    cy.get('.profile__geolocation > .fa-pen').click();
    cy.wait('@getCities');
    cy.get('.city-search > :nth-child(5):contains("Абакан")').click();
    cy.get('.current-city__value').contains(city);
    // save it
    cy.intercept('/api/v1/profile/**').as('updateCity');
    cy.get('.btn').click();
    cy.wait('@updateCity').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });

    cy.get('.profile__geolocation').contains(city);
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    const city = 'Абакан';

    // city
    cy.intercept('/api/v1/**').as('getCities');
    cy.get('.profile__geolocation > .fa-pen').click();
    cy.wait('@getCities');
    cy.get('.city-search > :nth-child(5):contains("Абакан")').click();
    cy.get('.current-city__value').contains(city);
    // save it
    cy.intercept('/api/v1/profile/**').as('updateCity');
    cy.get('.btn').click();
    cy.wait('@updateCity').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });

    cy.get('.profile__geolocation').contains(city);
  });
});
