describe('Delete Work', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addWork');
    cy.task('fs:addWork');
    cy.auth('test@test.com', '123456');
  });

  it('Desktop', () => {
    // click on works
    cy.get('.profile__cards > :nth-child(3) > img').click();

    cy.intercept('/api/v1/master/**').as('deleteWork');

    // delete work
    cy.get('.master-work__title').then(($element) => {
      cy.wrap($element).click({ force: true });
      // delete
      cy.get('.btn-icon--fail').click();
    });

    cy.wait('@deleteWork').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
      // close carousel view
      cy.get('.fa-times').click();

      cy.get('.master-work__title').should('not.exist');
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    // click on works
    cy.get('.profile__cards > :nth-child(3) > img').click();

    cy.intercept('/api/v1/master/**').as('deleteWork');

    // delete work
    cy.get('.master-work__title').then(($element) => {
      cy.wrap($element).click({ force: true });
      // delete
      cy.get('.btn-icon--fail').click();
    });

    cy.wait('@deleteWork').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
      // close carousel view
      cy.get('.back-bar__main > .svg-inline--fa').click();

      cy.get('.master-work__title').should('not.exist');
    });
  });
});
