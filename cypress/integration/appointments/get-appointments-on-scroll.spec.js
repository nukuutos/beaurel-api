describe('Get appointments on scroll', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addAppointmentsOnScroll');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/appointments' });
    cy.get('.appointments__appointment-types', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
    cy.get('.appointment-types__type--notification').click();
    cy.wait('@getConfirmedAppointments');
    cy.get('.appointment-card').should('have.length', 10);

    // check sort
    // check first appointment
    cy.get(':nth-child(1) > .appointments__date').contains('17-04-2021');
    cy.get(':nth-child(1) > :nth-child(2) > .appointment-card__time').contains('04:00');
    cy.get(':nth-child(1) > :nth-child(3) > .appointment-card__time').contains('06:00');
    cy.get(':nth-child(1) > :nth-child(4) > .appointment-card__time').contains('08:00');

    cy.intercept('GET', '/api/v1/profile/**').as('getNextAppointments');
    cy.window().scrollTo('bottom');
    cy.wait('@getNextAppointments');
    cy.get('.appointment-card').should('have.length', 12);

    cy.get(':nth-child(3) > .appointments__date').contains('19-04-2021');
    cy.get(':nth-child(7) > .appointment-card__time').contains('14:00');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
    cy.get('.appointment-types__type--notification').click();
    cy.wait('@getConfirmedAppointments');
    cy.get('.appointment-card').should('have.length', 10);

    // check sort
    // check first appointment
    cy.get(':nth-child(1) > .appointments__date').contains('17-04-2021');
    cy.get(':nth-child(1) > :nth-child(2) .appointment-card__time').contains('04:00');
    cy.get(':nth-child(1) > :nth-child(3) .appointment-card__time').contains('06:00');
    cy.get(':nth-child(1) > :nth-child(4) .appointment-card__time').contains('08:00');

    cy.intercept('GET', '/api/v1/profile/**').as('getNextAppointments');
    cy.window().scrollTo('bottom');
    cy.wait('@getNextAppointments');
    cy.get('.appointment-card').should('have.length', 12);

    cy.get(':nth-child(3) .appointments__date').contains('19-04-2021');
    cy.get(':nth-child(7) .appointment-card__time').contains('14:00');
  });
});
