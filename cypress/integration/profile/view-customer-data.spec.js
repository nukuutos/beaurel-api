describe('View customer data', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addCustomer');
    cy.task('db:addReview');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
    cy.get('.profile__cards', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.intercept('/api/v1/profile/**').as('getCustomerProfile');
    cy.get('.review-card__customer-photo').click();
    cy.wait('@getCustomerProfile');
    cy.get('.customer-card__city').should('be.visible');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.intercept('/api/v1/profile/**').as('getCustomerProfile');
    cy.get('.review-card__customer-photo').click();
    cy.wait('@getCustomerProfile');
    cy.get('.customer-card__city').should('be.visible');
    cy.get('.back-bar__main > .svg-inline--fa > path').click();
    cy.get('.profile__about').should('be.visible');
  });
});
