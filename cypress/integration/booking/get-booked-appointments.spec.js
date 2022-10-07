// You must have 08:00 appointment
// Your appointments must be clean
describe('Get booked appointments', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetable');
    cy.task('db:addBookedAppointments');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
    cy.get('.profile__identity', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments0');
    cy.get('.profile__cards > :nth-child(1) > span > img').click();
    cy.wait('@getBookedAppointments0');
    cy.get('.booking-timetable__arrow').should('be.visible').last().click();
    cy.get('.booking-timetable__arrow').should('be.visible').last().click();

    const weekdayIndex = new Date().getDay(); // 0 - sunday

    if (weekdayIndex === 0 || weekdayIndex === 6) {
      cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments1');
      cy.get('.booking-timetable__arrow').should('be.visible').last().click();
      cy.wait('@getBookedAppointments1');
    } else {
      cy.get('.booking-timetable__arrow').should('be.visible').last().click();
      cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments1');
      cy.get('.booking-timetable__arrow').should('be.visible').last().click();
      cy.wait('@getBookedAppointments1');
    }
  });
});
