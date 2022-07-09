// You must have 08:00 appointment
// Your appointments must be clean

const time = '08:00';

describe('Book with expired unsuitable service', () => {
  beforeEach(() => {
    cy.task('db:addDataForBookWithExpiredUnsuitableService');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
    cy.get('.profile__identity', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop, services first', () => {
    cy.intercept('GET', '/api/v1/master/**').as('getServices');
    cy.get(':nth-child(2) > span > img').click();
    cy.wait('@getServices');

    cy.get('.booking-service--disabled').should('be.visible');
  });

  it('Desktop, timetable first, book appointment with expired service', () => {
    cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments');
    cy.get('.profile__cards > :nth-child(1) > span > img').click();
    cy.wait('@getBookedAppointments');

    const date = new Date();
    const weekdayToday = date.getDay(); // 0 - sunday, ..., 6 - saturday

    if (weekdayToday === 0) {
      cy.get('.booking-timetable__arrow').last().click();
    }

    cy.intercept('GET', '/api/v1/master/**').as('getServices');
    cy.get(`.booking-timetable__appointment:contains('${time}')`).first().click();
    cy.wait('@getServices');

    cy.get('.booking-service--disabled').should('be.visible');
  });

  it('Phone, services first', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/master/**').as('getServices');
    cy.get(':nth-child(2) > span > img').click();
    cy.wait('@getServices');

    cy.get('.booking-service--disabled').should('be.visible');
  });

  it('Phone, timetable first, book appointment with expired service', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments');
    cy.get('.profile__cards > :nth-child(1) > span > img').click();
    cy.wait('@getBookedAppointments');

    // must disable appointments or vise versa

    // cy.get('.booking-timetable__side--right > .booking-timetable__arrow').click();

    // cy.intercept('GET', '/api/v1/master/**').as('getServices');
    // cy.get(`.booking-timetable__appointment:contains('${time}')`).first().click();
    // cy.wait('@getServices');

    // cy.get('.booking-service--disabled').should('be.visible');
    //
  });
});
