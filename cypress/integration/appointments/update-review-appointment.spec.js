// You must have 08:00 appointment
// Your appointments must be clean
describe('Update review appointment', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addCustomer');
    cy.task('db:addHistoryAppointment');
    cy.task('db:addReview');
    // go to auth
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/appointments' });
    cy.get('.appointments__appointment-types', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.intercept('GET', '/api/v1/profile/**').as('getHistoryAppointments');
    cy.get('.appointment-types__type').contains('история').click({ force: true });
    cy.wait('@getHistoryAppointments');
    cy.get('.appointments__appointment-card').should('be.visible');
    //  open review modal
    cy.get('.btn').click();
    cy.get('.stars > :nth-child(1) > path').click();
    cy.get('.edit-review__textarea').clear().type('супер коммент');
    cy.intercept('PUT', '/api/v1/master/**').as('updateReview');
    cy.get('.edit-review__form > .btn').click();
    cy.wait('@updateReview').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.intercept('GET', '/api/v1/profile/**').as('getHistoryAppointments');
    cy.get('.appointment-types__type').contains('история').click({ force: true });
    cy.wait('@getHistoryAppointments');

    cy.get('.appointments__appointment-card').should('be.visible');
    //  open review modal
    cy.get('.btn').click();
    cy.get('.stars > :nth-child(1) > path').click({ force: true });
    cy.get('.edit-review__textarea').clear().type('супер коммент');
    cy.intercept('PUT', '/api/v1/master/**').as('updateReview');
    cy.get('.edit-review__form > .btn').click();
    cy.wait('@updateReview').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });
  });
});
