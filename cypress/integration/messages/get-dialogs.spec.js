describe('Get dialogs', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addCustomer');
    cy.task('db:addMasters');
    cy.task('db:addDialogsLastMessages');

    cy.auth('test@test.com', '123456');
    cy.getCookie('refreshToken').then((data) => {
      cy.visit('/messages', { headers: { cookie: `refreshToken=${data.value}` } });
    });
  });

  it('Desktop', () => {
    cy.get('.messages__dialog-card:contains("first")').should('have.length', 2);
    cy.get('.dialog-card--unread').should('be.visible');
    cy.get('.dialog-card:not(.dialog-card--unread)').should('be.visible');

    cy.intercept('GET', '/api/v1/profile/**').as('getMessages');
    cy.get('.dialog-card--unread').click();
    cy.wait('@getMessages');

    cy.get('.dialog-card--unread').should('not.exist');
  });

  it('Phone', () => {
    cy.viewport(330, 500);
    cy.get('.messages__dialog-card:contains("first")').should('have.length', 2);
    cy.get('.dialog-card--unread').should('be.visible');
    cy.get('.dialog-card:not(.dialog-card--unread)').should('be.visible');

    cy.intercept('GET', '/api/v1/profile/**').as('getMessages');
    cy.get('.dialog-card--unread').click();
    cy.wait('@getMessages');

    cy.get('.fa-arrow-left > path').click();
    cy.get('.dialog-card--unread').should('not.exist');
  });
});
