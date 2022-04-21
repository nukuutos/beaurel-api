describe('Update manually timetable', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetable');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/timetable' });
    cy.get('.timetable__timetable-card', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get('.radio-button.mt-2 > .radio-button__input').click();
    // add time
    cy.get(':nth-child(1) > .weekday__appointments > .weekday__time').click();
    cy.get('.add-time > .btn').click();
    // check
    cy.get('.content').contains('ПН: 09:00');
    cy.get('.weekday__time').contains('09:00');
    // update timetable
    cy.get('.btn--primary').click();
    cy.get('.date-picker__button').click();
    cy.get('.weekday__time').contains('09:00');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.radio-button.mt-2 > .radio-button__input').click();
    // add time
    cy.get(':nth-child(1) > .weekday__appointments > .weekday__time').click();
    cy.get('.add-time > .btn').click();
    // check
    cy.get('.content').contains('ПН: 09:00');
    cy.get('.weekday__time').contains('09:00');
    // update timetable
    cy.get('.btn--primary').click();
    cy.get('.date-picker__button').click();
    cy.get('.weekday__time').contains('09:00');
  });
});
