// update session time to 90min!
const title = 'УслугаДляОбновления';

describe('Update auto timetable', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetable');
    cy.task('db:addService', title);
    // go to auth
    cy.auth('test@test.com', '123456');
    // go to timetable
    cy.get(':nth-child(6) > a').click();
    cy.get('.timetable__timetable-card', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    // change sessionTime to 90 minutes
    cy.get('.timetable-card--edit > .timetable-card__btn-edit').click();
    cy.get('.timetable-card__select').select(2);
    cy.get('.timetable-card__btn-edit--primary').click();

    // add tuesday to weekends
    cy.get('.timetable__form > :nth-child(3) > :nth-child(4)').click();
    cy.get('[name="edit.auto.weekends.1"]').click();
    cy.get('.weekends__button').click();

    // select working day start at 11:00
    cy.get('.timetable-card__btn-edit--bottom').click();
    cy.get('.mr-1').select(10);
    cy.get('.timetable-card__btn-edit--primary').click();

    // disable first monday appointment
    cy.get(':nth-child(1) > .weekday__appointments > :nth-child(1)').click();

    // check weekend
    cy.get('.timetable-visual > :nth-child(2) > .weekday__appointments').then(($weekday) => {
      const children = $weekday.children();
      // no appointments times;
      expect(children.length).to.equal(0);
    });

    // check working day start at
    cy.get('.timetable-visual').contains('08:00').should('not.exist');
    cy.get('.timetable-visual').contains('11:00').should('be.visible');

    // check disabled appointments
    cy.get('.timetable__form > :nth-child(3)').contains('ПН: 11:00').should('be.visible');

    // open date-picker
    cy.get('.btn--primary').click();
    //  update
    cy.intercept('/api/v1/master/**').as('updateTimetable');
    cy.get('.date-picker__button').click();
    cy.wait('@updateTimetable');
    // button for change services duration
    cy.intercept('/api/v1/master/**').as('getUnsuitableServices');
    cy.get('.update-success__btn').click();
    cy.wait('@getUnsuitableServices');
    // update services
    cy.get('.edit-service__input > .input').each(($input) => cy.wrap($input).select(1));
    // save
    cy.intercept('/api/v1/master/**').as('updateUnsuitableServices');
    cy.get('.services__container > .btn').click();
    cy.wait('@updateUnsuitableServices');
    // check on visualization of updated timetable

    // check weekend
    cy.get(
      '.content > :nth-child(3) > .timetable-visual > :nth-child(2) > .weekday__appointments'
    ).then(($weekday) => {
      const children = $weekday.children();
      // no appointment times;
      expect(children.length).to.equal(0);
    });

    // check working day start at
    cy.get('.content > :nth-child(3) > .timetable-visual').contains('08:00').should('not.exist');
    cy.get('.content > :nth-child(3) > .timetable-visual').contains('11:00').should('be.visible');

    // check disabled appointments
    cy.get('.content > :nth-child(3)  .weekday__time--exception').should('be.visible');

    // go to services
    cy.get(':nth-child(5) > a').click();
    cy.get('.services__heading', { timeout: 60000 }).should('be.visible');
    // click alert
    cy.get('.update-alert__button').click();
    // check alert
    cy.get('.booking-services > .services__container').then(($container) => {
      const children = $container.children();
      expect(children.length).to.not.equal(0);
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    // change sessionTime to 90 minutes
    cy.get('.timetable-card--edit > .timetable-card__btn-edit').click();
    cy.get('.timetable-card__select').select(2);
    cy.get('.timetable-phone-edit-modal__button').click();

    // add tuesday to weekends
    cy.get('.timetable__form > :nth-child(3) > :nth-child(4)').click();
    cy.get('[name="edit.auto.weekends.1"]').click();
    cy.get('.weekends__button').click();

    // select working day start at 11:00
    cy.get('.timetable__form > :nth-child(3) > :nth-child(7)').click();
    cy.get('.mr-1').select(10);
    cy.get('.timetable-phone-edit-modal__button').click();

    // disable first monday appointment
    cy.get(':nth-child(1) > .weekday__appointments > :nth-child(1)').click();

    // check weekend
    cy.get('.timetable-visual > :nth-child(2) > .weekday__appointments').then(($weekday) => {
      const children = $weekday.children();
      // no appointment times;
      expect(children.length).to.equal(0);
    });

    // check working day start at
    cy.get('.timetable-visual').contains('08:00').should('not.exist');
    cy.get('.timetable-visual').contains('11:00').should('be.visible');

    // check disabled appointment
    cy.get('.timetable__form > :nth-child(3)').contains('ПН: 11:00').should('be.visible');

    // open date-picker
    cy.get('.btn--primary').click();
    //  update
    cy.intercept('/api/v1/master/**').as('updateTimetable');
    cy.get('.date-picker__button').click();
    cy.wait('@updateTimetable');
    // button for change services duration
    cy.intercept('/api/v1/master/**').as('getUnsuitableServices');
    cy.get('.update-success__btn').click();
    cy.wait('@getUnsuitableServices');
    // update services
    cy.get('.edit-service__input > .input').each(($input) => cy.wrap($input).select(1));
    // save
    cy.intercept('/api/v1/master/**').as('updateUnsuitableServices');
    cy.get('.services__container > .btn').click();
    cy.wait('@updateUnsuitableServices');
    // check on visualization of updated timetable

    // check weekend
    cy.get(
      '.content > :nth-child(3) > .timetable-visual > :nth-child(2) > .weekday__appointments'
    ).then(($weekday) => {
      const children = $weekday.children();
      // no appointment times;
      expect(children.length).to.equal(0);
    });

    // check working day start at
    cy.get('.content > :nth-child(3) > .timetable-visual').contains('08:00').should('not.exist');
    cy.get('.content > :nth-child(3) > .timetable-visual').contains('11:00').should('be.visible');

    // check disabled appointment
    cy.get('.content > :nth-child(3)  .weekday__time--exception').should('be.visible');

    // go to services
    cy.get('.mobile-navbar__main > :nth-child(5)').click();
    cy.get('.navbar > :nth-child(5) > a').click();
    cy.get('.services__heading', { timeout: 60000 }).should('be.visible');
    // click alert
    cy.get('.update-alert__button').click();
    // check alert
    cy.get('.booking-services > .services__container').then(($container) => {
      const children = $container.children();
      expect(children.length).to.not.equal(0);
    });
  });
});
