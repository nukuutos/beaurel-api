const { deleteServiceDesktop, findService } = require('./utils');

const title = 'Хорошее такое название';

describe('Delete service', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetable');
    cy.task('db:addService', title);
    // go to auth
    cy.auth('test@test.com', '123456');
    // go to services
    cy.get(':nth-child(5) > a').click();
    cy.get('.services__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get('.service').contains(title).should('be.visible');
    deleteServiceDesktop(title);
    cy.get('.service').contains(title).should('not.exist');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.service').contains(title).should('be.visible');
    // click delete button
    findService(title, () => {
      cy.intercept('/api/v1/master/**').as('deleteService');
      cy.get('.service__mobile-buttons > :nth-child(1)').click();
      cy.wait('@deleteService').then((xhr) => {
        expect(xhr.response.statusCode).to.equal(200);
      });
    });

    cy.get('.service').contains(title).should('not.exist');
  });
});
