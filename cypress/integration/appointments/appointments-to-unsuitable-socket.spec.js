const timetableId = '5f1e9682bc7d1919843a5879';
const masterId = '5eb849b81c2ccc21306ced34';

const timetableUpdate = {
  manually: {
    appointments: {
      0: [],
      1: [600],
      2: [720],
      3: [],
      4: [720, 840],
      5: [],
      6: [],
    },
  },
  masterId: '5eb849b81c2ccc21306ced34',
  type: 'auto',
  timezone: 'Asia/Vladivostok',
  sessionTime: '90',
  auto: {
    workingDay: { startAt: 480, endAt: 1080 },
    weekends: [6],
    possibleAppointmentsTime: [480, 570, 660, 750, 840, 940, 1030],
    exceptions: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
  },
  date: '2022-02-21T00:00:00.000Z',
};

describe('Update unsuitable appointment as master', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addCustomer');
    cy.task('db:addTimetable');
    cy.task('db:addConfirmedAppointment');
    // go to auth
    cy.auth('test1@test.com', '123456');
    // go to appointments
    cy.get(':nth-child(3) > a').click();
    cy.get('.appointment-types__type', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
    cy.get('.appointment-types__type').contains('подтверждены').click({ force: true });
    cy.wait('@getConfirmedAppointments');
    cy.get('.appointments__appointment-card').should('be.visible');
    // change appointment
    cy.request('POST', 'http://localhost:5000/api/v1/auth/sign-in', {
      identificator: 'test@test.com',
      password: '123456',
    }).then((authData) => {
      cy.request({
        method: 'POST',
        url: `http://localhost:5000/api/v1/master/${masterId}/timetable/${timetableId}/update`,
        body: timetableUpdate,
        headers: {
          Authorization: `Bearer ${authData.body.accessToken}`,
        },
      }).then(() => {
        cy.get('.appointments__appointment-card', { timeout: 60000 }).should('not.exist');
        cy.intercept('GET', '/api/v1/profile/**').as('getUnsuitableAppointments');
        cy.get('.appointment-types__type--notification').click();
        cy.wait('@getUnsuitableAppointments');
        cy.get('.appointments__appointment-card').should('be.visible');
      });
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
    cy.get('.appointment-types__type').contains('подтверждены').click({ force: true });
    cy.wait('@getConfirmedAppointments');
    cy.get('.appointments__appointment-card').should('be.visible');
    // change appointment
    cy.request('POST', 'http://localhost:5000/api/v1/auth/sign-in', {
      identificator: 'test@test.com',
      password: '123456',
    }).then((authData) => {
      cy.request({
        method: 'POST',
        url: `http://localhost:5000/api/v1/master/${masterId}/timetable/${timetableId}/update`,
        body: timetableUpdate,
        headers: {
          Authorization: `Bearer ${authData.body.accessToken}`,
        },
      }).then(() => {
        cy.get('.appointments__appointment-card', { timeout: 60000 }).should('not.exist');
        cy.intercept('GET', '/api/v1/profile/**').as('getUnsuitableAppointments');
        cy.get('.appointment-types__type--notification').click();
        cy.wait('@getUnsuitableAppointments');
        cy.get('.appointments__appointment-card').should('be.visible');
      });
    });
  });
});
