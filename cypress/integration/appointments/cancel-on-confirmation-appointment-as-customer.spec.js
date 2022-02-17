// You must have 08:00 appointment
// Your appointments must be clean
describe('Cancel on confirmation appointment as customer', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addOnConfirmationAppointmentMaster');
    // go to auth
    cy.auth('test@test.com', '123456');
    // go to appointments
    cy.get(':nth-child(3) > a').click();
    cy.get('.appointments__controller', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    // check appointment as customer
    cy.intercept('GET', '/api/v1/profile/**').as('getAppointmentsAsCustomer');
    cy.get('.appointment-controller__item:not(.appointment-controller__item--active)').click();
    cy.wait('@getAppointmentsAsCustomer');
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
    cy.get('.appointments__appointment-card').should('be.visible');
    // cancel appointment
    cy.intercept('PUT', '/api/v1/master/**').as('cancelAppointment');
    cy.get('.btn--fail').click();
    cy.wait('@cancelAppointment');
    cy.get('.appointments__appointment-card').should('not.exist');
  });
});
