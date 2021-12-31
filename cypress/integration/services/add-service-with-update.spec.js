const { addServiceDesktop, checkServiceAppearance } = require('./utils');

const title = 'Хорошее такое название';
const price = 2131;

describe('Add service with update', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetableWithUpdate');
    // go to auth
    cy.auth('test@test.com', '123456');
    // go to services
    cy.get(':nth-child(4) > a').click();
    cy.get('.services__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    addServiceDesktop({ title, price });
    checkServiceAppearance({ title, price });
    cy.get('.update-alert__button').click();
    cy.get(
      '.booking-services > .services__container > .service > .service__side--right > .service__duration'
    ).contains('01:30');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.service--add').click();
    cy.get('#title').type(title);
    cy.get('.add-service__duration > .input--icon > .input').select(1);
    cy.get('.add-service__price > .input--icon > .input').type(price);

    cy.intercept('/api/v1/master/**').as('addService');

    cy.get('.add-service__button').click();

    cy.wait('@addService').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(201);
    });

    checkServiceAppearance({ title, price });
    cy.get('.update-alert__button').click();
    cy.get(
      '.booking-services > .services__container > .service > .service__side--right > .service__duration'
    ).contains('01:30');
  });
});
