// You must have 08:00 appointment
// Your appointments must be clean
describe('Update review appointment', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addCustomer');
    cy.task('db:addHistoryAppointment');
    cy.task('db:addReview');
    // go to auth
    cy.auth('test1@test.com', '123456');
    // go to appointments
    cy.get(':nth-child(3) > a').click();
    cy.get('.appointments__controller', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    // check appointment as customer
    cy.intercept('GET', '/api/v1/profile/**').as('getAppointmentsAsCustomer');
    cy.get('.appointment-controller__item:not(.appointment-controller__item--active)').click();
    cy.wait('@getAppointmentsAsCustomer');

    cy.intercept('GET', '/api/v1/profile/**').as('getHistoryAppointments');
    cy.get('.appointment-types__type').contains('история').click({ force: true });
    cy.wait('@getHistoryAppointments');
    cy.get('.appointments__appointment-card').should('be.visible');
    //  open review modal
    cy.get('.btn').click();
    cy.get('.stars > :nth-child(1) > path').click();
    cy.get('.edit-review__textarea').clear().type('супер коммент');
    cy.intercept('PUT', '/api/v1/master/**').as('updateReview');
    cy.get('.edit-review__button > .btn').click();
    cy.wait('@updateReview').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });

    // cancel appointment
    // cy.get('.appointments__appointment-card').should('not.exist');
  });

  it('Phone', () => {
    cy.viewport(330, 500);
    // check appointment as customer
    cy.intercept('GET', '/api/v1/profile/**').as('getAppointmentsAsCustomer');
    cy.get('.appointment-controller__item:not(.appointment-controller__item--active)').click();
    cy.wait('@getAppointmentsAsCustomer');

    cy.intercept('GET', '/api/v1/profile/**').as('getHistoryAppointments');
    cy.get('.appointment-types__type').contains('история').click({ force: true });
    cy.wait('@getHistoryAppointments');

    cy.get('.appointments__appointment-card').should('be.visible');
    //  open review modal
    cy.get('.btn').click();
    cy.get('.stars > :nth-child(1) > path').click();
    cy.get('.edit-review__textarea').clear().type('супер коммент');
    cy.intercept('PUT', '/api/v1/master/**').as('updateReview');
    cy.get('.edit-review__button > .btn').click();
    cy.wait('@updateReview').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });
  });
});
