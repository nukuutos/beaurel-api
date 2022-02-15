describe('Get appointments on scroll', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addAppointmentsOnScroll');
    // go to auth
    cy.auth('test@test.com', '123456');
    // go to appointments
    cy.get(':nth-child(3) > a').click();
    cy.get('.appointments__appointment-types', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
    cy.get('.appointment-types__type--notification').click();
    cy.wait('@getConfirmedAppointments');

    cy.intercept('GET', '/api/v1/profile/**').as('getNextAppointments');
    cy.window().scrollTo('bottom');
    cy.wait('@getNextAppointments');

    cy.get('.appointment-card').should('have.length', 12);
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
    cy.get('.appointment-types__type--notification').click();
    cy.wait('@getConfirmedAppointments');

    cy.intercept('GET', '/api/v1/profile/**').as('getNextAppointments');
    cy.window().scrollTo('bottom');
    cy.wait('@getNextAppointments');

    cy.get('.appointment-card').should('have.length', 12);
  });
});
