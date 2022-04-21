describe('Go to master in search', () => {
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
    // click first master in search
    cy.get('.content > :nth-child(3)').click();
    // check for profile visibility
    cy.get('.profile__header', { timeout: 10000 }).should('be.visible');
  });

  it('Phone', () => {
    cy.viewport(330, 500);
    // click first master in search
    cy.get('.content > :nth-child(3)').click();
    // check for profile visibility
    cy.get('.profile__header', { timeout: 10000 }).should('be.visible');
  });
});
