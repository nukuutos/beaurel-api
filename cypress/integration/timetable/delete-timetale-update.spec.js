// update session time to 90min!

describe('Delete timetable update', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetableWithUpdate');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/timetable' });
    cy.get('.timetable__timetable-card', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get('.content > :nth-child(3)').should('be.visible');
    cy.get('.timetable-card__delete-btn').click();
    cy.intercept('/api/v1/master/**').as('deleteTimetableUpdate');
    cy.get('.btn--primary').click();
    cy.wait('@deleteTimetableUpdate');
    cy.get('.content > :nth-child(3)').should('not.exist');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.content > :nth-child(3)').should('be.visible');
    cy.get('.timetable-card__delete-btn').click();
    cy.intercept('/api/v1/master/**').as('deleteTimetableUpdate');
    cy.get('.btn--primary').click();
    cy.wait('@deleteTimetableUpdate');
    cy.get('.content > :nth-child(3)').should('not.exist');
  });
});
