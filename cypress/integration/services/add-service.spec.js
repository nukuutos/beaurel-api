const { addServiceDesktop, checkServiceAppearance } = require('./utils');

const title = 'Хорошее такое название';
const price = 2131;

describe('Add service', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetable');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/services' });
    cy.get('.services__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    addServiceDesktop({ title, price });
    checkServiceAppearance({ title, price });
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.btn-text').click();
    cy.get('#title').type(title);
    cy.get('.add-service__duration > .input--icon > .input').select(1);
    cy.get('.add-service__price > .input--icon > .input').type(price);

    cy.intercept('/api/v1/master/**').as('addService');

    cy.get('.add-service__button').click();

    cy.wait('@addService').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(201);
    });

    checkServiceAppearance({ title, price });
  });
});
