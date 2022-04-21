describe('Sign in', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.visit('/sign-in');
    cy.get('form', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get('#identificator', { timeout: 60000 }).should('be.visible').type('test');
    cy.get('#password').type('123456');

    cy.intercept('/api/v1/auth/**').as('signIn');
    cy.get('.btn--primary').click();
    cy.wait('@signIn');

    cy.url().should('include', '/test');
    cy.get('.profile__header', { timeout: 60000 }).should('be.visible');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('#identificator', { timeout: 60000 }).should('be.visible').type('test');
    cy.get('#password').type('123456');

    cy.intercept('/api/v1/auth/**').as('signIn');
    cy.get('.btn--primary').click();
    cy.wait('@signIn');

    cy.url().should('include', '/test');
    cy.get('.profile__header', { timeout: 60000 }).should('be.visible');
  });
});
