const { findService } = require('./utils');

const title = 'Хорошее такое название';
const currentParameter = 'Параметр0';
const newParameter = 'Параметр1';
const newPrice = 32;

const checkSubServiceAppearance = ({ parameter, price }) => {
  const durationRegexp = /^[0-2][0-9]:[0-5][0-9]$/;
  cy.get('.service').contains(parameter).should('be.visible');
  findService(parameter, () => {
    cy.get('.service__side--right > .mt-5').contains(price).should('be.visible');
    cy.get('.service__side--right > .mt-1').contains(durationRegexp).should('be.visible');
  });
};

describe('Update sub-service', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetable');
    cy.task('db:addServiceParameter', { title, parameter: currentParameter });
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/services' });
    cy.get('.services__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get('.service').contains(title).should('be.visible').click();
    cy.get('.service').contains(currentParameter).should('be.visible');
    // click edit button
    findService(currentParameter, () => cy.get('.service__btn--first').click());
    // edit
    cy.get('.edit-service__textarea').clear().type(newParameter);
    cy.get('.service__side--right > :nth-child(1) > .input').select(0);
    cy.get(':nth-child(2) > .input').clear().type(newPrice);
    cy.intercept('/api/v1/master/**').as('updateServiceParameter');
    cy.get('form.service > .service__btn--first').click();
    cy.wait('@updateServiceParameter').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });

    checkSubServiceAppearance({ parameter: newParameter, price: newPrice });
    cy.get('.service').contains(currentParameter).should('not.exist');
  });

  it('Phone', () => {
    cy.viewport(330, 500);
    cy.get('.service').contains(title).should('be.visible').click();
    cy.get('.service').contains(currentParameter).should('be.visible');
    // click edit button
    findService(currentParameter, () => cy.get('.service__mobile-buttons > :nth-child(2)').click());

    cy.get('.edit-service__textarea').clear().type(newParameter);
    cy.get('.service__side--right > :nth-child(1) > .input').select(0);
    cy.get(':nth-child(2) > .input').clear().type(newPrice);
    cy.intercept('/api/v1/master/**').as('updateServiceParameter');
    cy.get('.service__btn--confirm').click();
    cy.wait('@updateServiceParameter').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });

    checkSubServiceAppearance({ parameter: newParameter, price: newPrice });
    cy.get('.service').contains(currentParameter).should('not.exist');
  });
});
