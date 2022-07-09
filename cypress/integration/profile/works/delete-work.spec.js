describe('Delete Work', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addWork');
    cy.task('fs:addWork');
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
    cy.get('.profile__cards', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    // click on works
    cy.get('.profile__cards > :nth-child(3) > span > img').click();

    cy.intercept('DELETE', '/api/v1/master/**').as('deleteWork');

    // delete work
    cy.get('.master-work__title').then(($element) => {
      cy.wrap($element).click({ force: true });
      // delete
      cy.get('.btn-icon--fail').click();
    });

    cy.wait('@deleteWork').then((xhr) => {
      console.log(xhr.response.statusCode);
      expect(xhr.response.statusCode).to.equal(200);
      // close carousel view
      cy.get('.modal__close').click();

      cy.get('.master-work__title').should('not.exist');
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    // click on works
    cy.get('.profile__cards > :nth-child(3) > span > img').click({ force: true });

    cy.intercept('DELETE', '/api/v1/master/**').as('deleteWork');

    // delete work
    cy.get('.master-work__title').then(($element) => {
      cy.wrap($element).click({ force: true });
      // delete
      cy.get('.btn-icon--fail').click();
    });

    cy.wait('@deleteWork').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
      // close carousel view
      cy.get('.back-bar__icon').click();

      cy.get('.master-work__title').should('not.exist');
    });
  });
});
