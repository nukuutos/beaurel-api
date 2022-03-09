// You must have 08:00 appointment
// Your appointments must be clean
describe('Get booked appointments', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetable');
    cy.task('db:addBookedAppointments');
    // go to auth
    cy.auth('test@test.com', '123456');
  });

  it('Desktop', () => {
    cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments0');
    cy.get('.profile__cards > :nth-child(1) > img').click();
    cy.wait('@getBookedAppointments0');
    cy.get('.booking-timetable__arrow').last().click();
    cy.get('.booking-timetable__arrow').last().click();
    cy.get('.booking-timetable__arrow').last().click();
    cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments1');
    cy.get('.booking-timetable__arrow').last().click();
    cy.wait('@getBookedAppointments1');
  });
});
