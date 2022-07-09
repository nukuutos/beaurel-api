// You must have 08:00 appointment
// Your appointments must be clean
describe('Cancel confirmed appointment as customer', () => {
  beforeEach(() => {
    cy.task('db:cancelledConfirmedAppointmentAsCustomer');
    // cy.task('db:addMaster');
    // cy.task('db:addConfirmedAppointmentMaster');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/appointments' });
    cy.get('.appointments__controller', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    // check appointment as customer
    cy.intercept('GET', '/api/v1/profile/**').as('getAppointmentsAsCustomer');
    cy.get('.appointment-controller__item:not(.appointment-controller__item--active)').click();
    cy.wait('@getAppointmentsAsCustomer');

    cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
    cy.get('.appointment-types__type').contains('подтверждены').click({ force: true });
    cy.wait('@getConfirmedAppointments');
    cy.get('.appointments__appointment-card').should('be.visible');

    cy.get('.appointments__appointment-card').should('be.visible');
    // cancel appointment
    cy.intercept('PUT', '/api/v1/master/**').as('cancelAppointment');
    cy.get('.btn--fail').click();
    cy.wait('@cancelAppointment');
    cy.get('.appointments__appointment-card').should('not.exist');
  });

  it('Phone', () => {
    cy.viewport(330, 500);
    // check appointment as customer
    cy.intercept('GET', '/api/v1/profile/**').as('getAppointmentsAsCustomer');
    cy.get('.appointment-controller__item:not(.appointment-controller__item--active)').click();
    cy.wait('@getAppointmentsAsCustomer');

    cy.intercept('GET', '/api/v1/profile/**').as('getConfirmedAppointments');
    cy.get('.appointment-types__type').contains('подтверждены').click({ force: true });
    cy.wait('@getConfirmedAppointments');
    cy.get('.appointments__appointment-card').should('be.visible');

    cy.get('.appointments__appointment-card').should('be.visible');
    // cancel appointment
    cy.intercept('PUT', '/api/v1/master/**').as('cancelAppointment');
    cy.get('.btn--fail').click({ force: true });
    cy.wait('@cancelAppointment');
    cy.get('.appointments__appointment-card').should('not.exist');
  });
});
