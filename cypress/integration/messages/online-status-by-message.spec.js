const masterId = '5eb849b81c2ccc21306ced34';
const customerId = '5eb849b81c2ccc21306abd12';

describe('Chat', () => {
  beforeEach(() => {
    cy.task('db:addCustomer');
    cy.task('db:addMaster');
    cy.auth('test1@test.com', '123456');
    cy.getCookie('refreshToken').then((data) => {
      cy.visit('/search', { headers: { cookie: `refreshToken=${data.value}` } });
    });
    cy.intercept('POST', '/api/v1/profile/**').as('starMaster');
    cy.get('.profile__star-profile').click();
    cy.wait('@starMaster');
    cy.getCookie('refreshToken').then((data) => {
      cy.visit('/messages', { headers: { cookie: `refreshToken=${data.value}` } });
    });
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
          Authorization: `Bearer ${authData.body.accessToken}`,
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
          Authorization: `Bearer ${authData.body.accessToken}`,
        },
      }).then(() => {
        cy.contains('В сети').should('be.visible');
      });
    });
  });
});
