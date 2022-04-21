// update session time to 90min!

describe('Create auto timetable', () => {
  beforeEach(() => {
    cy.task('db:addMasterBeginner');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
    // go to timetable
    cy.get('.no-master-tools__link').click();
    cy.get('.timetable-card__tip', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    // select session time
    cy.get('#sessionTime').select(1);
    cy.get('.btn').click();
    // auto timetable
    cy.get('.btn').click();
    // select working day
    cy.get('.select.mr-1').select(0);
    cy.get('.select.ml-1').select(11);
    cy.get('.btn').click();
    // add weekend
    cy.get('[name="auto.weekends.5"]').click();
    cy.get('.btn').click();
    // add exception
    cy.get(':nth-child(1) > .weekday__appointments > :nth-child(1)').click();
    cy.get('.btn').click();
    // check
    cy.get('.timetable-card__value').contains('сб');
    cy.get('.content').contains('60 мин');
    cy.get('.content').contains('08:00 - 19:00');
    cy.get('.content').contains('ПН: 08:00');
    cy.get('.weekday__time--exception').should('be.visible');
    cy.get('.no-master-tools').should('be.visible');
    // to services
    cy.get('.no-master-tools__link').click();
    cy.get('.services__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    // select session time
    cy.get('#sessionTime').select(1);
    cy.get('.btn').click();
    // auto timetable
    cy.get('.btn').click();
    // select working day
    cy.get('.select.mr-1').select(0);
    cy.get('.select.ml-1').select(11);
    cy.get('.btn').click();
    // add weekend
    cy.get('[name="auto.weekends.5"]').click();
    cy.get('.btn').click();
    // add exception
    cy.get(':nth-child(1) > .weekday__appointments > :nth-child(1)').click({ force: true });
    cy.get('.btn').click();
    // check
    cy.get('.no-master-tools').should('be.visible');
    cy.get('.back-bar__main > .svg-inline--fa > path').click();

    cy.get('.timetable-card__value').contains('сб');
    cy.get('.content').contains('60 мин');
    cy.get('.content').contains('08:00 - 19:00');
    cy.get('.content').contains('ПН: 08:00');
    cy.get('.weekday__time--exception').should('be.visible');
  });
});
