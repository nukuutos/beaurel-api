// You must have 08:00 appointment
// Your appointments must be clean
describe('Cancel on confirmation appointment as master', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addOnConfirmationAppointmentMaster');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/appointments' });
    cy.get('.appointments__controller', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get('.appointments__appointment-card').should('be.visible');
    // reject appointment
    cy.intercept('PUT', '/api/v1/master/**').as('rejectAppointment');
    cy.get('.btn--fail').click();
    cy.wait('@rejectAppointment');
    cy.get('.appointments__appointment-card').should('not.exist');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.appointments__appointment-card').should('be.visible');
    // reject appointment
    cy.intercept('PUT', '/api/v1/master/**').as('rejectAppointment');
    cy.get('.btn--fail').click();
    cy.wait('@rejectAppointment');
    cy.get('.appointments__appointment-card').should('not.exist');
  });
});
