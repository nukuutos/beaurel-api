describe('Go to master in search', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addMasters');
    // go to auth
    cy.auth('test@test.com', '123456');
    // go to search
    cy.get(':nth-child(2) > a').click();
    cy.get('.search__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    // click first master in search
    cy.get('.content > :nth-child(3)').click();
    // check for profile visibility
    cy.get('.profile__header').should('be.visible');
  });

  it('Phone', () => {
    cy.viewport(330, 500);
    // click first master in search
    cy.get('.content > :nth-child(3)').click();
    // check for profile visibility
    cy.get('.profile__header').should('be.visible');
  });
});
