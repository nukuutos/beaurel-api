// update session time to 90min!

describe('Create manually timetable', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
    // go to timetable
    cy.get(':nth-child(6) > a').click();
    cy.get('.timetable-card__tip', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    // select session time
    cy.get('#sessionTime').select(2);
    cy.get('.btn').click();
    // manually timetable
    cy.get('.mt-6.choice-card').click();
    cy.get('.btn').click();
    // add appointments
    cy.get(':nth-child(1) > .weekday__appointments > .weekday__time').click();
    cy.get('.add-time > .btn').click();

    cy.get(':nth-child(2) > .weekday__appointments > .weekday__time').click();
    cy.get('.add-time > .btn').click();
    // create timetable
    cy.get('.btn').click();

    cy.get('.content').contains('90 мин');
    cy.get('.content').contains('ПН: 09:00');
    cy.get('.content').contains('ВТ: 09:00');
    cy.get('.weekday__time:not(.weekday__time--add)').should('have.length', 2);
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    // select session time
    cy.get('#sessionTime').select(2);
    cy.get('.btn').click();
    // manually timetable
    cy.get('.mt-6.choice-card').click();
    cy.get('.btn').click();
    // add first appointment
    cy.get(':nth-child(1) > .weekday__appointments > .weekday__time').click({ force: true });
    cy.get('.add-time > .btn').click();
    // add second appointment
    cy.get(':nth-child(1) > .weekday__appointments > .weekday__time--add').click();
    cy.get('[name="manually.hours"]').select(3);
    cy.get('.add-time > .btn').click();
    cy.get('.weekday__time:contains("09:00")').should('be.visible');
    cy.get('.weekday__time:contains("11:00")').should('be.visible');

    cy.get(':nth-child(2) > .weekday__appointments > .weekday__time').click();
    cy.get('.add-time > .btn').click();
    // create timetable
    cy.get('.btn').click();

    cy.get('.content').contains('90 мин');
    cy.get('.content').contains('ПН: 09:00, 11:00');
    cy.get('.content').contains('ВТ: 11:00');
    cy.get('.weekday__time:not(.weekday__time--add)').should('have.length', 3);
  });
});
