const { addServiceParameter } = require('./utils');

const title = 'Хорошее такое название';
const subServiceParameter0 = 'Параметр0';
const subServiceParameter1 = 'Параметр1';
const durationRegexp = /^[0-2][0-9]:[0-5][0-9]$/;
const price = 2131;

const checkForSubServiceAppearance = (parameterName) => {
  cy.get('.service__title').contains(parameterName).should('be.visible');
  cy.get('.service:not(.service.service--add)').each(($service) => {
    cy.wrap($service).within(() =>
      cy.get('.service__title').then(($title) => {
        const text = $title.text();
        if (text === parameterName) {
          // price
          cy.get('.service__side--right > .mt-5').contains(price).should('be.visible');
          // duration
          cy.get('.service__side--right > .mt-1').contains(durationRegexp).should('be.visible');
          return false;
        }
        return true;
      })
    );
  });
};

describe('Add service-parameter', () => {
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
    addServiceParameter({
      title,
      subServices: [
        { parameter: subServiceParameter0, price },
        { parameter: subServiceParameter1, price },
      ],
    });

    cy.get('.service__title').contains(title).should('be.visible').click();

    checkForSubServiceAppearance(subServiceParameter0);
    checkForSubServiceAppearance(subServiceParameter1);

    cy.get('.update-alert__button').click();
    cy.get('.booking-services .service__title').contains(title).should('be.visible').click();
    cy.get(
      '.booking-services > .services__container > .service-parameter--hover > :nth-child(2) > .service__side--right > .mt-1'
    ).contains('01:30');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    addServiceParameter({
      title,
      subServices: [
        { parameter: subServiceParameter0, price },
        { parameter: subServiceParameter1, price },
      ],
    });

    cy.get('.service__title').contains(title).should('be.visible').click();
    checkForSubServiceAppearance(subServiceParameter0);
    checkForSubServiceAppearance(subServiceParameter1);

    cy.get('.update-alert__button').click();
    cy.get('.booking-services .service__title').contains(title).click({ force: true });
    cy.get(
      '.booking-services > .services__container > .service-parameter--hover > :nth-child(2) > .service__side--right > .mt-1'
    ).contains('01:30');
  });
});
