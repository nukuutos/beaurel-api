const getWeekdayRU = (date = new Date()) => {
  let weekdayIndex = date.getDay();
  weekdayIndex -= 1;
  if (weekdayIndex < 0) weekdayIndex += 7;
  return weekdayIndex;
};

// You must have 08:00 appointment
// Your appointments must be clean
describe('Update unsuitable appointment after timetable update date', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetable');
    cy.task('db:addUnsuitableAppointmentMaster');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/appointments' });
    cy.get('.appointments__controller', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.intercept('GET', '/api/v1/profile/**').as('getUnsuitableAppointments');
    cy.get('.appointment-types__type').contains('неподходящие').click({ force: true });
    cy.wait('@getUnsuitableAppointments');
    cy.get('.appointments__appointment-card').should('be.visible');
    // change appointment
    cy.get('.btn--primary').click();
    cy.get('.input--error > .input').select(1);
    cy.get('.add-service__button').click();

    // 0 - monday, ..., 6 - sunday
    const weekday = getWeekdayRU();
    if (weekday >= 5) cy.get('.booking-timetable__arrow').last().click();

    const time = '08:00';

    cy.get('.booking-timetable__appointment').contains(time).first().click();

    cy.intercept('PUT', '/api/v1/master/**').as('changeUnsuitableAppointment');
    cy.get('.booking-result__button').click();
    cy.wait('@changeUnsuitableAppointment');

    cy.get('.appointments__appointment-card').should('not.exist');

    cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
    cy.get('.appointments__appointment-types > :nth-child(2)').click();
    cy.wait('@getConfirmedAppointments');

    cy.get('.appointments__appointment-card').should('be.visible');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/profile/**').as('getUnsuitableAppointments');
    cy.get('.appointment-types__type').contains('неподходящие').click({ force: true });
    cy.wait('@getUnsuitableAppointments');
    cy.get('.appointments__appointment-card').should('be.visible');
    // change appointment
    cy.get('.btn--primary').click();
    cy.get('.input--error > .input').select(1);
    cy.get('.add-service__button').click();

    const time = '08:00';
    // 0 - monday, ..., 6 - sunday
    // const weekday = getWeekdayRU();
    // if (weekday >= 5) cy.get('.btn-text').click();

    cy.get('.booking-timetable__appointment').contains(time).first().click();

    cy.intercept('PUT', '/api/v1/master/**').as('changeUnsuitableAppointment');
    cy.get('.booking-result__button').click();
    cy.wait('@changeUnsuitableAppointment');
    // });

    cy.get('.appointments__appointment-card').should('not.exist');

    cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
    cy.get('.appointments__appointment-types > :nth-child(2)').click();
    cy.wait('@getConfirmedAppointments');

    cy.get('.appointments__appointment-card').should('be.visible');
  });
});
