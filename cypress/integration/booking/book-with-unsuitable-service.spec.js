// You must have 08:00 appointment
// Your appointments must be clean

const time = '08:00';

describe('Book with unsuitable service', () => {
  beforeEach(() => {
    cy.task('db:addDataForBookWithUnsuitableService');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
    cy.get('.profile__identity', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop, services first', () => {
    cy.intercept('GET', '/api/v1/master/**').as('getServices');
    cy.get(':nth-child(2) > span > img').click();
    cy.wait('@getServices');

    cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments');
    cy.get('.service').click();
    cy.wait('@getBookedAppointments');

    const date = new Date();
    const weekdayToday = date.getDay(); // 0 - sunday, ..., 6 - saturday

    if (weekdayToday === 6) {
      cy.get(`.booking-timetable__appointment:contains('${time}')`).should('have.length', 1);
      cy.get('.booking-timetable__arrow:not(.booking-timetable__arrow--disabled)')
        .should('be.visible')
        .click();

      cy.get(`.booking-timetable__appointment:contains('${time}')`).should('have.length', 1);
    } else if (weekdayToday === 0) {
      cy.get('.booking-timetable__arrow:not(.booking-timetable__arrow--disabled)')
        .should('be.visible')
        .click();

      cy.get(`.booking-timetable__appointment:contains('${time}')`).should('have.length', 2);
    } else {
      cy.get(`.booking-timetable__appointment:contains('${time}')`).should('have.length', 2);
    }

    cy.get(`.booking-timetable__appointment:contains('${time}')`).first().click();
    cy.get('.booking-result > :nth-child(7)').contains('08:00 - 10:00');

    cy.intercept('POST', '/api/v1/master/**').as('bookAppointment');
    cy.get('.booking-result__button').click();
    cy.wait('@bookAppointment');

    cy.get('.booking-success__button').click();
  });

  it('Desktop, timetable first, book appointment that is before update', () => {
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

    cy.get('.service').click();
    cy.get('.booking-result > :nth-child(7)').contains('08:00 - 10:00');

    cy.intercept('POST', '/api/v1/master/**').as('bookAppointment');
    cy.get('.booking-result__button').click();
    cy.wait('@bookAppointment');

    cy.get('.booking-success__button').click();
  });

  it('Desktop, timetable first, book appointment that is after update', () => {
    cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments');
    cy.get('.profile__cards > :nth-child(1) > span > img').click();
    cy.wait('@getBookedAppointments');

    const date = new Date();
    const weekdayToday = date.getDay(); // 0 - sunday, ..., 6 - saturday

    if (weekdayToday === 0 || weekdayToday >= 5) {
      cy.get('.booking-timetable__arrow:not(.booking-timetable__arrow--disabled)')
        .should('be.visible')
        .click();
    }

    const time = '09:30';

    cy.intercept('GET', '/api/v1/master/**').as('getServices');
    cy.get(`.booking-timetable__appointment:contains('${time}')`).first().click();
    cy.wait('@getServices');

    cy.get('.booking-service--disabled').should('exist');
  });

  it('Phone, services first', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/master/**').as('getServices');
    cy.get(':nth-child(2) > span > img').click();
    cy.wait('@getServices');

    cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments');
    cy.get('.service').click();
    cy.wait('@getBookedAppointments');

    cy.get(`.booking-timetable__appointment:contains('${time}')`).should('have.length', 1);
    cy.get('.booking-timetable__side--right > .booking-timetable__arrow').click();

    cy.get(`.booking-timetable__appointment:contains('${time}')`).should('have.length', 1);
    cy.get('.booking-timetable__side--right > .booking-timetable__arrow').should('not.exist');

    cy.get(`.booking-timetable__appointment:contains('${time}')`).first().click();
    cy.get('.booking-result').contains('08:00 - 10:00');

    cy.intercept('POST', '/api/v1/master/**').as('bookAppointment');
    cy.get('.booking-result__button').click();
    cy.wait('@bookAppointment');

    cy.get('.booking-success__button').click();
  });

  it('Phone, timetable first, book appointment that is before update', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments');
    cy.get('.profile__cards > :nth-child(1) > span > img').click();
    cy.wait('@getBookedAppointments');

    cy.intercept('GET', '/api/v1/master/**').as('getServices');
    cy.get(`.booking-timetable__appointment:contains('${time}')`).first().click();
    cy.wait('@getServices');

    cy.get('.service').click();
    cy.get('.booking-result').contains('08:00 - 10:00');

    cy.intercept('POST', '/api/v1/master/**').as('bookAppointment');
    cy.get('.booking-result__button').click();
    cy.wait('@bookAppointment');

    cy.get('.booking-success__button').click();
  });

  it('Phone, timetable first, book appointment that is after update', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments');
    cy.get('.profile__cards > :nth-child(1) > span > img').click();
    cy.wait('@getBookedAppointments');

    cy.get('.booking-timetable__side--right > .booking-timetable__arrow').click();
    cy.get('.booking-timetable__side--right > .booking-timetable__arrow').click();

    const time = '09:30';

    cy.intercept('GET', '/api/v1/master/**').as('getServices');
    cy.get(`.booking-timetable__appointment:contains('${time}')`).first().click();
    cy.wait('@getServices');

    cy.get('.booking-service--disabled').should('exist');
  });
});
