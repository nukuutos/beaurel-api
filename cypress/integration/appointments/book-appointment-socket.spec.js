const serviceId = '6121fc9f8fce2120cc841b6c';
const masterId = '5eb849b81c2ccc21306ced34';

describe('Book appointment socket', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetable');
    cy.task('db:addService', 'service');
    cy.task('db:addCustomer');
    // go to auth
    cy.auth('test@test.com', '123456');
  });

  it('Desktop', () => {
    cy.request('POST', 'http://localhost:5000/api/v1/auth/sign-in', {
      identificator: 'test1@test.com',
      password: '123456',
    }).then((authData) => {
      cy.request({
        method: 'POST',
        url: `http://localhost:5000/api/v1/master/${masterId}/appointment`,
        body: {
          serviceId,
          time: { startAt: 600, endAt: 720 },
          date: '2023-12-25T00:00:00.000Z',
        },
        headers: {
          Authorization: `Bearer ${authData.body.accessToken}`,
        },
      }).then(() => {
        cy.get('.navbar__link--notification').should('be.visible').click();
        cy.get('.appointments__appointment-card', { timeout: 60000 }).should('be.visible');
      });
    });

    cy.request('POST', 'http://localhost:5000/api/v1/auth/sign-in', {
      identificator: 'test1@test.com',
      password: '123456',
    }).then((authData) => {
      cy.request({
        method: 'POST',
        url: `http://localhost:5000/api/v1/master/${masterId}/appointment`,
        body: {
          serviceId,
          time: { startAt: 720, endAt: 840 },
          date: '2023-12-25T00:00:00.000Z',
        },
        headers: {
          Authorization: `Bearer ${authData.body.accessToken}`,
        },
      }).then(() => {
        cy.get('.appointments__appointment-card').should('have.length', 2);
      });
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);
    // check appointment as customer
    cy.request('POST', 'http://localhost:5000/api/v1/auth/sign-in', {
      identificator: 'test1@test.com',
      password: '123456',
    }).then((authData) => {
      cy.request({
        method: 'POST',
        url: `http://localhost:5000/api/v1/master/${masterId}/appointment`,
        body: {
          serviceId,
          time: { startAt: 600, endAt: 720 },
          date: '2023-12-25T00:00:00.000Z',
        },
        headers: {
          Authorization: `Bearer ${authData.body.accessToken}`,
        },
      }).then(() => {
        cy.get('.mobile-navbar__item--notification').should('be.visible').click();
        cy.get('.appointments__appointment-card', { timeout: 60000 }).should('be.visible');
      });
    });

    cy.request('POST', 'http://localhost:5000/api/v1/auth/sign-in', {
      identificator: 'test1@test.com',
      password: '123456',
    }).then((authData) => {
      cy.request({
        method: 'POST',
        url: `http://localhost:5000/api/v1/master/${masterId}/appointment`,
        body: {
          serviceId,
          time: { startAt: 720, endAt: 840 },
          date: '2023-12-25T00:00:00.000Z',
        },
        headers: {
          Authorization: `Bearer ${authData.body.accessToken}`,
        },
      }).then(() => {
        cy.get('.appointments__appointment-card').should('have.length', 2);
      });
    });
  });
});
