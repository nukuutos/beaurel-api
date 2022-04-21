describe('Find masters on typing', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addMasters');
    // set city
    localStorage.setItem('city', 'Владивосток');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/search' });
    // go to search
    cy.get('.search__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.intercept('/api/v1/master**').as('getMasters');
    cy.get('.input--icon > .input').type('Никита Волошин');
    cy.wait('@getMasters');
    cy.get('.search__master-card').should('be.visible');

    cy.intercept('/api/v1/master**').as('getMasters');
    cy.get('.input--icon > .input').clear().type('Волошин Никита');
    cy.wait('@getMasters');
    cy.get('.search__master-card').should('be.visible');

    cy.intercept('/api/v1/master**').as('getMasters');
    cy.get('.input--icon > .input').clear().type('Волошин');
    cy.wait('@getMasters');
    cy.get('.search__master-card').should('be.visible');

    cy.intercept('/api/v1/master**').as('getMasters');
    cy.get('.input--icon > .input').clear().type('Никита');
    cy.wait('@getMasters');
    cy.get('.search__master-card').should('be.visible');

    cy.intercept('/api/v1/master**').as('getMasters');
    cy.get('.input--icon > .input').clear().type('Чтото интересное');
    cy.wait('@getMasters');
    cy.get('.search__master-card').should('not.exist');

    cy.get('.search__specialization > .input').select('Визажист');
    cy.intercept('/api/v1/master**').as('getMasters');
    cy.get('.input--icon > .input').clear().type('Волошин Никита');
    cy.wait('@getMasters');
    cy.get('.search__master-card').should('be.visible');

    cy.intercept('/api/v1/master**').as('getMasters');
    cy.get('.search__specialization > .input').select('Парикмахер');
    cy.wait('@getMasters');
    cy.get('.search__master-card').should('not.exist');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.intercept('/api/v1/master**').as('getMasters');
    cy.get('.input--icon > .input').type('Никита Волошин');
    cy.wait('@getMasters');
    cy.get('.search__master-card').should('be.visible');

    cy.intercept('/api/v1/master**').as('getMasters');
    cy.get('.input--icon > .input').clear().type('Волошин Никита');
    cy.wait('@getMasters');
    cy.get('.search__master-card').should('be.visible');

    cy.intercept('/api/v1/master**').as('getMasters');
    cy.get('.input--icon > .input').clear().type('Волошин');
    cy.wait('@getMasters');
    cy.get('.search__master-card').should('be.visible');

    cy.intercept('/api/v1/master**').as('getMasters');
    cy.get('.input--icon > .input').clear().type('Никита');
    cy.wait('@getMasters');
    cy.get('.search__master-card').should('be.visible');

    cy.intercept('/api/v1/master**').as('getMasters');
    cy.get('.input--icon > .input').clear().type('Чтото интересное');
    cy.wait('@getMasters');
    cy.get('.search__master-card').should('not.exist');

    cy.get('.search__specialization > .input').select('Визажист');
    cy.intercept('/api/v1/master**').as('getMasters');
    cy.get('.input--icon > .input').clear().type('Волошин Никита');
    cy.wait('@getMasters');
    cy.get('.search__master-card').should('be.visible');

    cy.intercept('/api/v1/master**').as('getMasters');
    cy.get('.search__specialization > .input').select('Парикмахер');
    cy.wait('@getMasters');
    cy.get('.search__master-card').should('not.exist');
  });
});
