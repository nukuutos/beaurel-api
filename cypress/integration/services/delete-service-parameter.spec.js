const { deleteServiceDesktop, findService } = require('./utils');

const title = 'Хорошее такое название';
const parameter = 'Параметр0';

describe('Delete service-parameter', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetable');
    cy.task('db:addServiceParameter', { title, parameter });
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/services' });
    cy.get('.services__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get('.service__title').should('be.visible');
    deleteServiceDesktop(title);
    cy.get('.service__title').should('not.exist');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.service__title').should('be.visible');

    findService(title, () => {
      cy.intercept('/api/v1/master/**').as('deleteService');
      cy.get('.service__mobile-buttons > :nth-child(1)').click();
      cy.wait('@deleteService').then((xhr) => {
        expect(xhr.response.statusCode).to.equal(200);
      });
    });

    cy.get('.service__title').should('not.exist');
  });
});
