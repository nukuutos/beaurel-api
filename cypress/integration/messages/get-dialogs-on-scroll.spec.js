describe('Get dialogs on scroll', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addMasters');
    cy.task('db:addDialogsOnScroll');
    // go to auth
    cy.auth('test@test.com', '123456');
    // go to messages
    cy.get(':nth-child(4) > a').click();
    cy.get('.messages__dialogs', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get('.dialog-card').should('have.length', 20);
    cy.intercept('GET', '/api/v1/profile/**').as('getDialogs');
    cy.get('.messages__dialogs > :nth-child(20)').scrollIntoView();
    cy.wait('@getDialogs');
    cy.get('.dialog-card').should('have.length', 22);
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.dialog-card').should('have.length', 20);
    cy.intercept('GET', '/api/v1/profile/**').as('getDialogs');
    cy.get('.messages__dialogs > :nth-child(20)').scrollIntoView();
    cy.wait('@getDialogs');
    cy.get('.dialog-card').should('have.length', 22);
  });
});
