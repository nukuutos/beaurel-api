describe('Chat with favorite', () => {
  beforeEach(() => {
    cy.task('db:addCustomer');
    cy.task('db:addMaster');
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/search' });
    cy.intercept('POST', '/api/v1/profile/**').as('starMaster');
    cy.get('.profile__star-profile').click();
    cy.wait('@starMaster');
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/messages' });
  });

  it('Desktop', () => {
    cy.intercept('GET', '/api/v1/profile/**').as('getFavorites');
    cy.get('.messages__new-dialog-icon').click();
    cy.wait('@getFavorites');

    cy.intercept('GET', '/api/v1/profile/**').as('getMessages');
    cy.get('.favorite-master').click();
    cy.wait('@getMessages');

    const message = 'Some message!';

    cy.get('#message').type(message);
    cy.intercept('POST', '/api/v1/profile/**').as('sendMessage');
    cy.get('.messages__form > .svg-inline--fa > path').click();
    cy.wait('@sendMessage');

    cy.get('.dialog__message').should('be.visible');
    cy.get('.messages__dialog-card').contains(message).should('be.visible');
  });

  it('Phone', () => {
    cy.viewport(330, 500);
    cy.intercept('GET', '/api/v1/profile/**').as('getFavorites');
    cy.get('.messages__new-dialog-icon').click();
    cy.wait('@getFavorites');

    cy.intercept('GET', '/api/v1/profile/**').as('getMessages');
    cy.get('.favorite-master').click();
    cy.wait('@getMessages');

    const message = 'Some message!';

    cy.get('#message').type(message);
    cy.intercept('POST', '/api/v1/profile/**').as('sendMessage');
    cy.get('.messages__form > .svg-inline--fa > path').click();
    cy.wait('@sendMessage');

    cy.get('.dialog__message').should('be.visible');
    cy.get('.fa-arrow-left > path').click();
    cy.get('.messages__dialog-card').contains(message).should('be.visible');
  });
});
