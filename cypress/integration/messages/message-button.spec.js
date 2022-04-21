describe('Message button', () => {
  beforeEach(() => {
    cy.task('db:addCustomer');
    cy.task('db:addMaster');
    localStorage.setItem('city', 'Владивосток');
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/search' });
    cy.get('.search__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get('.search__master-card').click();
    cy.get('.profile__about-btn', { timeout: 60000 }).should('be.visible').click();
    cy.get('.active-user__name').should('be.visible').contains('Никита В.');
  });

  it('Phone', () => {
    cy.viewport(330, 500);
    cy.get('.search__master-card').click();
    cy.get('.profile__about-btn', { timeout: 60000 }).should('be.visible').click();
    cy.get('.active-user__name').should('be.visible').contains('Никита В.');
  });
});
