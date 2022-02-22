// update session time to 90min!
const title = 'УслугаДляОбновления';

describe('Update unsuitable services', () => {
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
    // open date-picker
    cy.get('.btn--primary').click();
    //  update
    cy.intercept('/api/v1/master/**').as('updateTimetable');
    cy.get('.date-picker__button').click();
    cy.wait('@updateTimetable');

    cy.get('.modal > .svg-inline--fa').click();

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

    // update services
    cy.get('.edit-service__input > .input').each(($input) => cy.wrap($input).select(1));
    // save
    cy.intercept('/api/v1/master/**').as('updateUnsuitableServices');
    cy.get('.services__container > .btn').click();
    cy.wait('@updateUnsuitableServices');
    // check change of service alert
    cy.get('.update-alert:not(.update-alert--error)').should('be.visible');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    // change sessionTime to 90 minutes
    cy.get('.timetable-card--edit > .timetable-card__btn-edit').click();
    cy.get('.timetable-card__select').select(2);
    cy.get('.timetable-phone-edit-modal__button').click();

    // open date-picker
    cy.get('.btn--primary').click();
    //  update
    cy.intercept('/api/v1/master/**').as('updateTimetable');
    cy.get('.date-picker__button').click();
    cy.wait('@updateTimetable');
    // click back button
    cy.get('.back-bar__main > .svg-inline--fa').click();
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
    // update services
    cy.get('.edit-service__input > .input').each(($input) => cy.wrap($input).select(1));
    // save
    cy.intercept('/api/v1/master/**').as('updateUnsuitableServices');
    cy.get('.services__container > .btn').click();
    cy.wait('@updateUnsuitableServices');
    // check change of service alert
    cy.get('.update-alert:not(.update-alert--error)').should('be.visible');
  });
});
