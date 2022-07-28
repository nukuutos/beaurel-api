const appointmentId = '6072f6a7ce01a00418b97a19';
const masterId = '5eb849b81c2ccc21306ced34';

describe('Update unsuitable appointment socket', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addCustomer');
    cy.task('db:addTimetable');
    cy.task('db:addUnsuitableAppointmentCustomer');
    // go to auth
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/appointments' });
    cy.get('.appointment-types__type', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.intercept('GET', '/api/v1/profile/**').as('getUnsuitableAppointments');
    cy.get('.appointment-types__type').contains('неподходящие').click({ force: true });
    cy.wait('@getUnsuitableAppointments');
    cy.get('.appointments__appointment-card').should('be.visible');
    // change appointment
    cy.request('POST', 'http://localhost:5000/api/v1/auth/sign-in', {
      identificator: 'test',
      password: '123456',
    }).then((authData) => {
      cy.request({
        method: 'PUT',
        url: `http://localhost:5000/api/v1/master/${masterId}/appointment/${appointmentId}/unsuitable`,
        body: {
          duration: 120,
          time: { startAt: 600, endAt: 720 },
          date: '2023-12-25T00:00:00.000Z',
        },
        headers: {
          Authorization: `Bearer ${authData.body.accessToken}`,
        },
      }).then(() => {
        cy.get('.appointments__appointment-card').should('not.exist');
        cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
        cy.get('.appointments__appointment-types > :nth-child(2)').click();
        cy.wait('@getConfirmedAppointments');
        cy.get('.appointments__appointment-card').should('be.visible');
        cy.get('.appointments__date').contains('25-12-2023');
      });
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/profile/**').as('getUnsuitableAppointments');
    cy.get('.appointment-types__type').contains('неподходящие').click({ force: true });
    cy.wait('@getUnsuitableAppointments');
    cy.get('.appointments__appointment-card').should('be.visible');
    // change appointment
    cy.request('POST', 'http://localhost:5000/api/v1/auth/sign-in', {
      identificator: 'test',
      password: '123456',
    }).then((authData) => {
      cy.request({
        method: 'PUT',
        url: `http://localhost:5000/api/v1/master/${masterId}/appointment/${appointmentId}/unsuitable`,
        body: {
          duration: 120,
          time: { startAt: 600, endAt: 720 },
          date: '2023-12-25T00:00:00.000Z',
        },
        headers: {
          Authorization: `Bearer ${authData.body.accessToken}`,
        },
      }).then(() => {
        cy.get('.appointments__appointment-card').should('not.exist');
        cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
        cy.get('.appointments__appointment-types > :nth-child(2)').click();
        cy.wait('@getConfirmedAppointments');
        cy.get('.appointments__appointment-card').should('be.visible');
        cy.get('.appointments__date').contains('25-12-2023');
      });
    });
  });
});
