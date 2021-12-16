const { findService } = require('./utils');

const currentTitle = 'Хорошее такое название';
const parameter = 'Параметр0';
const newTitle = 'Такое название';

describe('Update service parameter title', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetable');
    cy.task('db:addServiceParameter', { title: currentTitle, parameter });
    // go to auth
    cy.auth('test@test.com', '123456');
    // go to services
    cy.get(':nth-child(4) > a').click();
    cy.get('.services__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get('.service').contains(currentTitle).should('be.visible');
    // click edit button
    findService(currentTitle, () => cy.get('.service__btn--first').click());
    // edit
    cy.get('.edit-service__textarea').clear().type(newTitle);
    cy.intercept('/api/v1/master/**').as('updateServiceParameter');
    cy.get('form.service > .service__btn--first').click();
    cy.wait('@updateServiceParameter').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });

    cy.get('.service').contains(newTitle).should('be.visible');
    cy.get('.service').contains(currentTitle).should('not.exist');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.service').contains(currentTitle).should('be.visible');
    // click edit button
    findService(currentTitle, () => cy.get('.service__mobile-buttons > :nth-child(2)').click());
    // edit
    cy.get('.edit-service__textarea').clear().type(newTitle);
    cy.intercept('/api/v1/master/**').as('updateServiceParameter');
    cy.get('.service__btn--confirm').click();
    cy.wait('@updateServiceParameter').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });

    cy.get('.service').contains(newTitle).should('be.visible');
    cy.get('.service').contains(currentTitle).should('not.exist');
  });
});
