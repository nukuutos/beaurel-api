// You must have 08:00 appointment
// Your appointments must be clean

const time = '08:00';

const getWeekdayRU = (date) => {
  let weekdayIndex = date.getDay();
  weekdayIndex -= 1;
  if (weekdayIndex < 0) weekdayIndex += 7;
  return weekdayIndex;
};

describe('Book with updated service', () => {
  beforeEach(() => {
    cy.task('db:addDataForBookWithUpdatedService');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
    cy.get('.profile__identity', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop, services first, before update', () => {
    cy.intercept('GET', '/api/v1/master/**').as('getServices');
    cy.get(':nth-child(2) > span > img').click();
    cy.wait('@getServices');

    cy.get('.services__switch').should('be.visible');

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
    cy.get('.booking-result').contains('08:00 - 10:00');

    cy.intercept('POST', '/api/v1/master/**').as('bookAppointment');
    cy.get('.booking-result__button').click();
    cy.wait('@bookAppointment');

    cy.get('.booking-success__button').click();
  });

  it('Desktop, services first, after update', () => {
    cy.intercept('GET', '/api/v1/master/**').as('getServices');
    cy.get(':nth-child(2) > span > img').click();
    cy.wait('@getServices');

    cy.get('.services__switch').should('be.visible');
    cy.get('.services__switch > :nth-child(2)').click();

    cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments');
    cy.get('.service').click();
    cy.wait('@getBookedAppointments');

    const date = new Date();
    const updateIn = 2; // days;
    const weekdayIndexBeforeUpdate = (getWeekdayRU(date) + updateIn) % 7; // 0 - mon, ..., 6 - sun

    if (weekdayIndexBeforeUpdate < 5) {
      const length = 6 - weekdayIndexBeforeUpdate;
      cy.get(`.booking-timetable__appointment:contains('${time}')`).should('have.length', length);
    } else {
      cy.get(`.booking-timetable__appointment:contains('${time}')`).should('have.length', 0);
    }

    cy.get('.booking-timetable__arrow:not(.booking-timetable__arrow--disabled)')
      .should('be.visible')
      .click();

    cy.get(`.booking-timetable__appointment:contains('${time}')`).should('have.length', 7);

    cy.get(`.booking-timetable__appointment:contains('${time}')`).first().click();
    cy.get('.booking-result').contains('08:00 - 09:30');

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
      cy.get('.booking-timetable__arrow:not(.booking-timetable__arrow--disabled)')
        .should('be.visible')
        .click();
    }

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

  it('Desktop, timetable first, book appointment that is after update', () => {
    cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments');
    cy.get('.profile__cards > :nth-child(1) > span > img').click();
    cy.wait('@getBookedAppointments');

    const date = new Date();
    const weekdayToday = date.getDay(); // 0 - sunday, ..., 6 - saturday

    if (weekdayToday === 0 || weekdayToday === 6 || weekdayToday === 5) {
      cy.get('.booking-timetable__arrow:not(.booking-timetable__arrow--disabled)')
        .should('be.visible')
        .click();
    }

    const time = '09:30';

    cy.intercept('GET', '/api/v1/master/**').as('getServices');
    cy.get(`.booking-timetable__appointment:contains('${time}')`).first().click();
    cy.wait('@getServices');

    cy.get('.service').first().click();

    cy.get('.booking-result').contains('09:30 - 11:00');

    cy.intercept('POST', '/api/v1/master/**').as('bookAppointment');
    cy.get('.booking-result__button').click();
    cy.wait('@bookAppointment');

    cy.get('.booking-success__button').click();
  });

  it('Phone, services first, before update', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/master/**').as('getServices');
    cy.get(':nth-child(2) > span > img').click();
    cy.wait('@getServices');

    cy.get('.services__switch').should('be.visible');

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

  it('Phone, services first, after update', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/master/**').as('getServices');
    cy.get(':nth-child(2) > span > img').click();
    cy.wait('@getServices');

    cy.get('.services__switch').should('be.visible');
    cy.get('.services__switch > :nth-child(2)').click();

    cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments');
    cy.get('.service').click();
    cy.wait('@getBookedAppointments');

    cy.get('.booking-timetable__arrow').should('have.length', 1);
    cy.get('.booking-timetable__arrow').click();
    cy.get('.booking-timetable__arrow').should('have.length', 2);

    cy.get(`.booking-timetable__appointment:contains('${time}')`).first().click();
    cy.get('.booking-result').contains('08:00 - 09:30');

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

    const time = '09:30';

    cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments');
    cy.get('.profile__cards > :nth-child(1) > span > img').click();
    cy.wait('@getBookedAppointments');

    cy.get('.booking-timetable__arrow').should('have.length', 1);

    cy.get('.booking-timetable__arrow--right').click();
    cy.get('.booking-timetable__arrow--right').click();

    cy.intercept('GET', '/api/v1/master/**').as('getServices');
    cy.get(`.booking-timetable__appointment:contains('${time}')`).first().click();
    cy.wait('@getServices');

    cy.get('.service').click();
    cy.get('.booking-result').contains('09:30 - 11:00');

    cy.intercept('POST', '/api/v1/master/**').as('bookAppointment');
    cy.get('.booking-result__button').click();
    cy.wait('@bookAppointment');

    cy.get('.booking-success__button').click();
  });
});
