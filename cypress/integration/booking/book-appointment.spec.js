// You must have 08:00 appointment
// Your appointments must be clean
describe('Book appointment', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetable');
    cy.task('db:addService', 'услуга');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
    cy.get('.profile__identity', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.intercept('GET', '/api/v1/master/**').as('getDataForBooking');
    cy.get('.profile__cards > :nth-child(1) > span > img').click();
    cy.wait('@getDataForBooking');

    cy.get('.booking-timetable').then(($layout) => {
      const time = '08:00';
      let isNextWeek;
      // if it is no appointments => click get next week
      if ($layout.find(`:contains('${time}')`).length < 2) {
        isNextWeek = true;
        cy.get('.booking-timetable__arrow').should('be.visible').last().click();
      }

      cy.get('.booking-timetable__appointment')
        .contains(time)
        .first()
        .then(($appointment) => {
          // get appointment day of week
          cy.wrap($appointment)
            .parent()
            .prev()
            .children(':first')
            .then(($bookingAppointmentDay) => {
              const bookingAppointmentDay = $bookingAppointmentDay.text();
              // click on appointment
              cy.wrap($appointment).click();
              // services
              cy.get('.booking-service:not(.booking-service--disabled)').first().click();
              // book appointment
              cy.intercept('POST', '/api/v1/master/**').as('bookAppointment');
              cy.get('.btn--primary').click();
              cy.wait('@bookAppointment');
              // success
              cy.get('.booking-success__button').click();
              // check if appointment was booked
              cy.get('.profile__cards > :nth-child(1) > span > img').click();
              if (isNextWeek) {
                cy.get('.booking-timetable__arrow').last().click();
              }

              const date = new Date();
              const weekdayIndex = date.getDay();
              const isFriday = weekdayIndex === 5;

              if (isFriday) {
                cy.get('.booking-timetable__appointment:contains("08:00")').should('not.exist');
              } else {
                cy.get('.booking-timetable__appointment')
                  .contains(time)
                  .first()
                  .then(($appointment) => {
                    cy.wrap($appointment)
                      .parent()
                      .prev()
                      .children(':first')
                      .then(($dayOfWeek) => {
                        const dayOfWeek = $dayOfWeek.text();
                        expect(bookingAppointmentDay).to.not.equal(dayOfWeek);
                      });
                  });
              }
            });
        });
      // go to appointments
      cy.get('.modal__close').click();
      cy.get(':nth-child(3) > a').click();
      cy.get('.appointments__controller', { timeout: 60000 }).should('be.visible');
      // go to confirmed appointments
      cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
      cy.get('.appointments__appointment-types > :nth-child(2)').click();
      cy.wait('@getConfirmedAppointments');
      // reject
      cy.intercept('PUT', '/api/v1/master/**').as('rejectAppointment');
      cy.get('.btn--fail').click();
      cy.wait('@rejectAppointment');
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/master/**').as('getDataForBooking');
    cy.get('.profile__cards > :nth-child(1) > span > img').click();
    cy.wait('@getDataForBooking');

    cy.get('.booking-timetable').then(($layout) => {
      if ($layout.find(`.btn-text`).length) {
        cy.get('.btn-text').should('be.visible').click();
      }

      const time = '08:00';

      cy.get('.booking-timetable__appointment').contains(time).click();
      cy.get('.booking-service:not(.booking-service--disabled)').first().click();
      // book appointment
      cy.intercept('POST', '/api/v1/master/**').as('bookAppointment');
      cy.get('.btn--primary').click();
      cy.wait('@bookAppointment');
      // success
      cy.get('.booking-success__button').click();
      // check if appointment was booked
      cy.get('.profile__cards > :nth-child(1) > span > img').click();
      // check
      cy.get('.booking-timetable').then(($layout) => {
        if ($layout.find(`.btn-text`).length) {
          cy.get('.btn-text').should('be.visible').click();
        }

        cy.get('.booking-timetable__appointment').contains(time).should('not.exist');
      });
    });

    cy.get('.back-bar__icon').click();
    cy.get('.mobile-navbar__main > :nth-child(5)').click();
    cy.get('.navbar__list > :nth-child(3) > a').click();
    cy.get('.appointments__controller', { timeout: 60000 }).should('be.visible');
    // go to confirmed appointments
    cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
    cy.get('.appointments__appointment-types > :nth-child(2)').click();
    cy.wait('@getConfirmedAppointments');
    // reject appointment
    cy.intercept('PUT', '/api/v1/master/**').as('rejectAppointment');
    cy.get('.btn--fail').click();
    cy.wait('@rejectAppointment');
  });
});
