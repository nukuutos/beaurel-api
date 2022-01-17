const masterId = '5eb849b81c2ccc21306ced34';
const customerId = '5eb849b81c2ccc21306abd12';

describe('Chat', () => {
  beforeEach(() => {
    cy.task('db:addCustomer');
    cy.task('db:addMaster');
    cy.auth('test1@test.com', '123456');
    cy.getCookie('refreshToken').then((data) => {
      cy.visit('/messages', { headers: { cookie: `refreshToken=${data.value}` } });
    });
  });

  it('Desktop', () => {
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
        cy.get('.messages__dialog-card').click();
        cy.get('#message').type('Some message!');
        cy.intercept('POST', '/api/v1/profile/**').as('sendMessage');
        cy.get('.messages__form > .svg-inline--fa > path').click();
        cy.wait('@sendMessage');
        cy.intercept('PUT', '/api/v1/profile/**').as('setMessageToViewed');
        cy.request({
          method: 'POST',
          url: `http://localhost:5000/api/v1/profile/${masterId}/message/${customerId}`,
          body: {
            message: 'last message',
          },
          headers: {
            Authorization: `Bearer ${authData.body.accessToken}`,
          },
        }).then(() => {
          cy.wait('@setMessageToViewed');
          cy.get('.dialog__message').should('have.length', 3);
          cy.get('.messages__dialog').contains('last message').should('be.visible');
          cy.get('.messages__dialog-card').contains('last message').should('be.visible');
          cy.task('db:getViewedMessages').then((count) => {
            expect(count).to.equal(2);
          });

          cy.request({
            method: 'PUT',
            url: `http://localhost:5000/api/v1/profile/${masterId}/message/${customerId}`,
            headers: {
              Authorization: `Bearer ${authData.body.accessToken}`,
            },
          }).then(() => {
            cy.get("[data-icon='check-double']").should('be.visible');
            cy.get("[data-icon='check']").should('not.exist');
          });
        });
      });
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);
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
        cy.get('.messages__dialog-card').click();
        cy.get('#message').type('Some message!');
        cy.intercept('POST', '/api/v1/profile/**').as('sendMessage');
        cy.get('.messages__form > .svg-inline--fa > path').click();
        cy.wait('@sendMessage');
        cy.intercept('PUT', '/api/v1/profile/**').as('setMessageToViewed');
        cy.request({
          method: 'POST',
          url: `http://localhost:5000/api/v1/profile/${masterId}/message/${customerId}`,
          body: {
            message: 'last message',
          },
          headers: {
            Authorization: `Bearer ${authData.body.accessToken}`,
          },
        }).then(() => {
          cy.wait('@setMessageToViewed');
          cy.get('.dialog__message').should('have.length', 3);
          cy.get('.messages__dialog').contains('last message').should('be.visible');

          cy.request({
            method: 'PUT',
            url: `http://localhost:5000/api/v1/profile/${masterId}/message/${customerId}`,
            headers: {
              Authorization: `Bearer ${authData.body.accessToken}`,
            },
          }).then(() => {
            cy.get("[data-icon='check-double']").should('be.visible');
            cy.get("[data-icon='check']").should('not.exist');

            cy.get('.fa-arrow-left > path').click();
            cy.get('.messages__dialog-card').contains('last message').should('be.visible');
            cy.task('db:getViewedMessages').then((count) => {
              expect(count).to.equal(3);
            });
          });
        });
      });
    });
  });
});
