const { checkServiceAppearance, findService } = require('./utils');

const currentTitle = 'Хорошее такое название';
const newTitle = 'Такое название';
const newPrice = 324;

describe('Update service', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addMasterTimetable');
    cy.task('db:addService', currentTitle);
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
    cy.get('.service__side--right > :nth-child(1) > .input').select(0);
    cy.get(':nth-child(2) > .input').clear().type(newPrice);
    cy.intercept('/api/v1/master/**').as('updateService');
    cy.get('form.service > .service__btn--first').click();
    cy.wait('@updateService').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });

    checkServiceAppearance({ title: newTitle, price: newPrice });
    cy.get('.service').contains(currentTitle).should('not.exist');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.service').contains(currentTitle).should('be.visible');
    // click edit button
    findService(currentTitle, () => cy.get('.service__mobile-buttons > :nth-child(2)').click());
    // update service
    cy.get('.edit-service__textarea').clear().type(newTitle);
    cy.get('.service__side--right > :nth-child(1) > .input').select(0);
    cy.get(':nth-child(2) > .input').clear().type(newPrice);
    cy.intercept('/api/v1/master/**').as('updateService');
    cy.get('.service__btn--confirm').click();
    cy.wait('@updateService').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });

    checkServiceAppearance({ title: newTitle, price: newPrice });
    cy.get('.service').contains(currentTitle).should('not.exist');
  });
});
