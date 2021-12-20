// Your appointments must be clean
describe('Cancel unsuitable appointment as master', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetable');
    cy.task('db:addUnsuitableAppointment');
    // go to auth
    cy.auth('test@test.com', '123456');
    // go to appointments
    cy.get(':nth-child(3) > a').click();
    cy.get('.appointments__controller', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.intercept('GET', '/api/v1/profile/**').as('getUnsuitableAppointments');
    cy.get('.appointment-types__type').contains('неподходящие').click({ force: true });
    cy.wait('@getUnsuitableAppointments');
    cy.get('.appointments__appointment-card').should('be.visible');
    // cancel
    cy.intercept('PUT', '/api/v1/master/**').as('changeStatus');
    cy.get('.btn--fail').click();
    cy.wait('@changeStatus');
    cy.get('.appointments__appointment-card').should('not.exist');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/profile/**').as('getUnsuitableAppointments');
    cy.get('.appointment-types__type').contains('неподходящие').click({ force: true });
    cy.wait('@getUnsuitableAppointments');
    cy.get('.appointments__appointment-card').should('be.visible');
    // cancel
    cy.intercept('PUT', '/api/v1/master/**').as('changeStatus');
    cy.get('.btn--fail').click();
    cy.wait('@changeStatus');
    cy.get('.appointments__appointment-card').should('not.exist');
  });
});
