// Your appointments must be clean
describe('Cancel unsuitable appointment as customer', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetable');
    cy.task('db:addUnsuitableAppointmentMaster');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/appointments' });
    cy.get('.appointments__controller', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    // check appointment as customer
    cy.intercept('GET', '/api/v1/profile/**').as('getAppointmentsAsCustomer');
    cy.get('.appointment-controller__item:not(.appointment-controller__item--active)').click();
    cy.wait('@getAppointmentsAsCustomer');

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

    // check appointment as customer
    cy.intercept('GET', '/api/v1/profile/**').as('getAppointmentsAsCustomer');
    cy.get('.appointment-controller__item:not(.appointment-controller__item--active)').click();
    cy.wait('@getAppointmentsAsCustomer');

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
