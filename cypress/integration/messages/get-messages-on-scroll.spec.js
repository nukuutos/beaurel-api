describe('Get messages on scroll', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addCustomer');
    cy.task('db:addMasters');
    cy.task('db:addDialog');

    cy.auth('test@test.com', '123456');
    cy.getCookie('refreshToken').then((data) => {
      cy.visit('/messages', { headers: { cookie: `refreshToken=${data.value}` } });
    });
  });

  it('Desktop', () => {
    cy.intercept('GET', '/api/v1/profile/**').as('getMessagesPage0');
    cy.get('.messages__dialog-card').click();
    cy.wait('@getMessagesPage0');

    cy.intercept('GET', '/api/v1/profile/**').as('getMessagesPage1');
    cy.get(':nth-child(20) > .dialog__message').scrollIntoView();
    cy.wait('@getMessagesPage1');

    cy.get(':nth-child(21) > .dialog__message').scrollIntoView();
  });

  it('Phone', () => {
    cy.viewport(330, 500);
    cy.intercept('GET', '/api/v1/profile/**').as('getMessagesPage0');
    cy.get('.messages__dialog-card').click();
    cy.wait('@getMessagesPage0');

    cy.intercept('GET', '/api/v1/profile/**').as('getMessagesPage1');
    cy.get(':nth-child(20) > .dialog__message').scrollIntoView();
    cy.wait('@getMessagesPage1');

    cy.get(':nth-child(21) > .dialog__message').scrollIntoView();
  });
});
