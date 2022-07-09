describe('Get appointments on scroll', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addReviewsOnScroll');
    // go to profile
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
    cy.get('.review-card', { timeout: 30000 }).should('have.length', 10);
  });

  it('Desktop', () => {
    cy.get(':nth-child(2) > .review-card__date').contains('15-12-2021');
    cy.intercept('GET', '/api/v1/master/**').as('getNextReviews');

    cy.get('.profile__reviews > :nth-child(8)').scrollIntoView();
    cy.wait('@getNextReviews');

    cy.get('.review-card').should('have.length', 15);
    cy.get(':nth-child(16) > .review-card__date').contains('13-12-2021');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.review-card').should('have.length', 10);
    cy.get(':nth-child(2) > .review-card__date').contains('15-12-2021');
    cy.intercept('GET', '/api/v1/master/**').as('getNextReviews');

    cy.get('.profile__reviews > :nth-child(8)').scrollIntoView();
    cy.wait('@getNextReviews');

    cy.get('.review-card').should('have.length', 15);
    cy.get(':nth-child(16) > .review-card__date').contains('13-12-2021');
  });
});
