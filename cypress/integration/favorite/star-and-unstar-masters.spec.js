describe('Star and unstar master', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addMasters');
    // go to auth
    cy.auth('test@test.com', '123456');
    // go to search
    cy.get(':nth-child(2) > a').click();
    cy.get('.search__heading', { timeout: 60000 }).should('be.visible');
  });

  afterEach(() => {
    cy.intercept('DELETE', '/api/v1/profile/**').as('unstarMaster');
    cy.get('.star-profile.star-profile--unstar').click({ force: true });
    cy.wait('@unstarMaster').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(204);
    });
  });

  it('Desktop', () => {
    cy.intercept('POST', '/api/v1/profile/**').as('starMaster');
    cy.get('.star-profile--invisible').first().click();
    cy.wait('@starMaster');

    cy.get(':nth-child(6) > a').click();
    cy.get('.masters__heading', { timeout: 60000 }).should('be.visible');

    cy.get('.star-profile.star-profile--unstar').should('have.length', 1);
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.intercept('POST', '/api/v1/profile/**').as('starMaster');
    cy.get('.star-profile--invisible').first().click();
    cy.wait('@starMaster');

    cy.get('.mobile-navbar__main > :nth-child(5)').click();
    cy.get(':nth-child(6) > a').click();
    cy.get('.masters__heading', { timeout: 60000 }).should('be.visible');

    cy.get('.star-profile.star-profile--unstar').should('have.length', 1);
  });
});
