describe('Message button', () => {
  beforeEach(() => {
    cy.task('db:addCustomer');
    cy.task('db:addMaster');
    cy.auth('test1@test.com', '123456');
  });

  it('Desktop', () => {
    cy.get(':nth-child(2) > a').click();
    cy.get('.search__heading').should('be.visible');
    cy.get('.search__master-card').click();
    cy.get('.profile__about-btn').should('be.visible').click();
    cy.get('.active-user__name').should('be.visible').contains('Никита В.');
  });

  it('Phone', () => {
    cy.viewport(330, 500);
    cy.get('.mobile-navbar__main > :nth-child(3)').click();
    cy.get('.search__heading').should('be.visible');
    cy.get('.search__master-card').click();
    cy.get('.profile__about-btn').should('be.visible').click();
    cy.get('.active-user__name').should('be.visible').contains('Никита В.');
  });
});
