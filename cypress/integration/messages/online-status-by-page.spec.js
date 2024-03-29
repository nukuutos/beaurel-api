const masterId = '5eb849b81c2ccc21306ced34';

describe('Update online status by visiting page', () => {
  beforeEach(() => {
    cy.task('db:addCustomer');
    cy.task('db:addMaster');
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/search' });
    cy.intercept('POST', '/api/v1/profile/**').as('starMaster');
    cy.get('.profile__star-profile').click();
    cy.wait('@starMaster');
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/messages' });
    cy.get('.content').contains('Сообщения').should('be.visible');
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
        method: 'PUT',
        url: `http://localhost:5000/api/v1/profile/${masterId}/online`,
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
        method: 'PUT',
        url: `http://localhost:5000/api/v1/profile/${masterId}/online`,
        headers: {
          [Cypress.env('AUTH_HEADER')]: `Bearer ${authData.body.accessToken}`,
        },
      }).then(() => {
        cy.contains('В сети').should('be.visible');
      });
    });
  });
});
