describe('Update place of work', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
    cy.get('.profile__cards', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    const city = 'Абакан';
    const street = 'Тургенев';
    const house = '4';
    const building = '2.2';
    const floor = '3';
    const salon = 'Ухуху красота';

    cy.get('.profile__geolocation > .fa-pen').click();
    // city
    cy.intercept('/api/v1/**').as('getCities');
    cy.get('.sign-up__input--city').click();
    cy.wait('@getCities');
    cy.get('.city-search > :nth-child(5):contains("Абакан")').click();
    cy.get('.current-city__value').contains(city);
    cy.get('.btn').click();

    // place of work
    cy.get('#street').clear().type(street);
    cy.get('#house').clear().type(house);
    cy.get('#building').clear().type(building);
    cy.get('#floor').clear().type(floor);
    // choose salon
    cy.get('.switch > :nth-child(2)').click();
    cy.get('#room-value').clear().type(salon);

    // save it
    cy.intercept('/api/v1/master/**').as('updatePlaceOfWork');
    cy.get('.btn').click();

    // // check status code
    cy.wait('@updatePlaceOfWork').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });

    cy.get('.profile__geolocation').contains(
      `ул. ${street} ${house}, к. ${building}, ${floor} этаж, салон`
    );
    // trouble with &laquo; and &raquo;
    cy.get('.profile__geolocation').contains(salon);
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    const city = 'Абакан';
    const street = 'Тургенев';
    const house = '4';
    const building = '2.2';
    const floor = '3';
    const salon = 'Ухуху красота';

    cy.get('.profile__geolocation > .fa-pen').click();
    // city
    cy.intercept('/api/v1/**').as('getCities');
    cy.get('.sign-up__input--city').click();
    cy.wait('@getCities');
    cy.get('.city-search > :nth-child(5):contains("Абакан")').click();
    cy.get('.current-city__value').contains(city);
    cy.get('.btn').click();

    // place of work
    cy.get('#street').clear().type(street);
    cy.get('#house').clear().type(house);
    cy.get('#building').clear().type(building);
    cy.get('#floor').clear().type(floor);
    // choose salon
    cy.get('.switch > :nth-child(2)').click();
    cy.get('#room-value').clear().type(salon);

    // save it
    cy.intercept('/api/v1/master/**').as('updatePlaceOfWork');
    cy.get('.btn').click();

    // // check status code
    cy.wait('@updatePlaceOfWork').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });

    cy.get('.profile__geolocation').contains(
      `ул. ${street} ${house}, к. ${building}, ${floor} этаж, салон`
    );
    // trouble with &laquo; and &raquo;
    cy.get('.profile__geolocation').contains(salon);
  });
});
