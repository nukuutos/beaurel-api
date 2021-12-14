// You must have 08:00 appointment
// Your appointments must be clean
describe('Confirm appointment', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addOnConfirmationAppointment');
    // go to auth
    cy.auth('test@test.com', '123456');
    // go to appointments
    cy.get(':nth-child(3) > a').click();
    cy.get('.appointments__controller', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    // check appointment as master
    cy.get('.appointments__appointment-card').should('be.visible');
    // confirm appointment
    cy.intercept('PUT', '/api/v1/master/**').as('confirmAppointment');
    cy.get('.btn--primary').click();
    cy.wait('@confirmAppointment');
    cy.get('.appointments__appointment-card').should('not.exist');
  });

  it('Phone', () => {
    cy.viewport(330, 500);
    // check appointment as master
    cy.get('.appointments__appointment-card').should('be.visible');
    // confirm appointment
    cy.intercept('PUT', '/api/v1/master/**').as('confirmAppointment');
    cy.get('.btn--primary').click();
    cy.wait('@confirmAppointment');
    cy.get('.appointments__appointment-card').should('not.exist');
  });
});
