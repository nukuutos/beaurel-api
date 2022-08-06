const masterId = '5eb849b81c2ccc21306ced34';
const appointmentId = '6072f6a7ce01a00418b97a19';

describe('Change appointment status socket', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addCustomer');
    cy.task('db:addOnConfirmationAppointmentCustomer');
    // go to auth
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/appointments' });
    cy.get('.appointments__appointment-types', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get('.appointments__appointment-card').should('be.visible');

    cy.request('POST', 'http://localhost:5000/api/v1/auth/sign-in', {
      identificator: 'test',
      password: '123456',
    }).then((authData) => {
      cy.request({
        method: 'PUT',
        url: `http://localhost:5000/api/v1/master/${masterId}/appointment/${appointmentId}/status/master`,
        body: {
          status: 'confirmed',
        },
        headers: {
          [Cypress.env('AUTH_HEADER')]: `Bearer ${authData.body.accessToken}`,
        },
      });
    });

    cy.get('.appointments__appointment-card').should('not.exist');

    cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
    cy.get('.appointment-types__type--notification').should('be.visible').click();
    cy.wait('@getConfirmedAppointments');

    cy.get('.appointments__appointment-card').should('be.visible');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.appointments__appointment-card').should('be.visible');

    cy.request('POST', 'http://localhost:5000/api/v1/auth/sign-in', {
      identificator: 'test',
      password: '123456',
    }).then((authData) => {
      cy.request({
        method: 'PUT',
        url: `http://localhost:5000/api/v1/master/${masterId}/appointment/${appointmentId}/status/master`,
        body: {
          status: 'confirmed',
        },
        headers: {
          [Cypress.env('AUTH_HEADER')]: `Bearer ${authData.body.accessToken}`,
        },
      });
    });

    cy.get('.appointments__appointment-card').should('not.exist');

    cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
    cy.get('.appointment-types__type--notification').should('be.visible').click();
    cy.wait('@getConfirmedAppointments');

    cy.get('.appointments__appointment-card').should('be.visible');
  });
});
