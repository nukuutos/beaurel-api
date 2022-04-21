describe('Star and unstar master', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addMasters');
    // go to auth
    // go to search
    localStorage.setItem('city', 'Владивосток');
    cy.authVisit({ identificator: 'test', password: '123456', page: '/search' });
    cy.get('.search__heading', { timeout: 60000 }).should('be.visible');
  });

  afterEach(() => {
    cy.intercept('DELETE', '/api/v1/profile/**').as('unstarMaster');
    cy.get('.star-profile.star-profile--unstar', { timeout: 10000 }).click({ force: true });
    cy.wait('@unstarMaster').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(204);
    });
  });

  it('Desktop', () => {
    cy.intercept('POST', '/api/v1/profile/**').as('starMaster');
    cy.get('.star-profile--invisible').first().click();
    cy.wait('@starMaster');

    cy.get(':nth-child(7) > a').click();
    cy.get('.masters__heading', { timeout: 60000 }).should('be.visible');

    cy.get('.star-profile.star-profile--unstar').should('have.length', 1);
  });
});
