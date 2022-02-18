// You must have 08:00 appointment
// Your appointments must be clean
describe('Review appointment', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addCustomer');
    cy.task('db:addHistoryAppointment');
    // go to auth
    cy.auth('test1@test.com', '123456');
    // go to appointments
    cy.get(':nth-child(3) > a').click();
    cy.get('.appointments__appointment-types', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.intercept('GET', '/api/v1/profile/**').as('getHistoryAppointments');
    cy.get('.appointment-types__type').contains('история').click({ force: true });
    cy.wait('@getHistoryAppointments');
    cy.get('.appointments__appointment-card').should('be.visible');
    //  open review modal
    cy.get('.btn').click();
    cy.get('.stars > :nth-child(2) > path').click();
    cy.get('.edit-review__textarea').type('Интересный коммент');
    cy.intercept('POST', '/api/v1/master/**').as('saveReview');
    cy.get('.edit-review__button > .btn').click();
    cy.wait('@saveReview').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(201);
    });

    // cancel appointment
    // cy.get('.appointments__appointment-card').should('not.exist');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/profile/**').as('getHistoryAppointments');
    cy.get('.appointment-types__type').contains('история').click({ force: true });
    cy.wait('@getHistoryAppointments');

    cy.get('.appointments__appointment-card').should('be.visible');
    //  open review modal
    cy.get('.btn').click();
    cy.get('.stars > :nth-child(2) > path').click({ force: true });
    cy.get('.edit-review__textarea').type('Интересный коммент');
    cy.intercept('POST', '/api/v1/master/**').as('saveReview');
    cy.get('.edit-review__button > .btn').click();
    cy.wait('@saveReview').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(201);
    });
  });
});
