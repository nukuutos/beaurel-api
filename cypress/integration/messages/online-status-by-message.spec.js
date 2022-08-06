const masterId = '5eb849b81c2ccc21306ced34';
const customerId = '5eb849b81c2ccc21306abd12';

describe('Chat', () => {
  beforeEach(() => {
    cy.task('db:addCustomer');
    cy.task('db:addMaster');
    localStorage.setItem('city', 'Владивосток');
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/search' });
    cy.intercept('POST', '/api/v1/profile/**').as('starMaster');
    cy.get('.profile__star-profile').click();
    cy.wait('@starMaster');
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/messages' });
    cy.get('.content').contains('Сообщения');
  });

  it('Desktop', () => {
    cy.intercept('GET', '/api/v1/profile/**').as('getFavorites');
    cy.get('.messages__new-dialog-icon').click();
    cy.wait('@getFavorites');

    cy.intercept('GET', '/api/v1/profile/**').as('getMessages');
    cy.get('.favorite-master').click();
    cy.wait('@getMessages');

    cy.contains('Был(а) в сети').should('be.visible');

    cy.request('POST', 'http://localhost:5000/api/v1/auth/sign-in', {
      identificator: masterId,
      password: '123456',
    }).then((authData) => {
      cy.request({
        method: 'POST',
        url: `http://localhost:5000/api/v1/profile/${masterId}/message/${customerId}`,
        body: {
          message: 'hi',
        },
        headers: {
          [Cypress.env('AUTH_HEADER')]: `Bearer ${authData.body.accessToken}`,
        },
      }).then(() => {
        cy.contains('В сети').should('be.visible');
      });
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);
    cy.intercept('GET', '/api/v1/profile/**').as('getFavorites');
    cy.get('.messages__new-dialog-icon').click();
    cy.wait('@getFavorites');

    cy.intercept('GET', '/api/v1/profile/**').as('getMessages');
    cy.get('.favorite-master').click();
    cy.wait('@getMessages');

    cy.contains('Был(а) в сети').should('be.visible');

    cy.request('POST', 'http://localhost:5000/api/v1/auth/sign-in', {
      identificator: masterId,
      password: '123456',
    }).then((authData) => {
      cy.request({
        method: 'POST',
        url: `http://localhost:5000/api/v1/profile/${masterId}/message/${customerId}`,
        body: {
          message: 'hi',
        },
        headers: {
          [Cypress.env('AUTH_HEADER')]: `Bearer ${authData.body.accessToken}`,
        },
      }).then(() => {
        cy.contains('В сети').should('be.visible');
      });
    });
  });
});
