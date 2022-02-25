const workTitle = 'Ухахаха';

describe('Add Work', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    // go to auth
    cy.auth('test@test.com', '123456');
  });

  afterEach(() => {
    cy.task('fs:deleteWork');
  });

  it('Desktop', () => {
    // click on works
    cy.get('.profile__cards > :nth-child(3) > img').click();
    cy.get('.master-works').then(($element) => {
      // get current length of works(including add-button)
      const initialChildrenLength = $element.children().length;
      // click on add work
      cy.get('.master-works__add-work').click();
      // click on upload image
      cy.get('.add-master-work__upload-input').attachFile('work.png');
      // add-title
      cy.get('#title').type(workTitle);
      // listen for request
      cy.intercept('/api/v1/master/**').as('addWork');
      // save
      cy.get('.btn--primary').click();
      // compare length
      cy.wait('@addWork').then((xhr) => {
        expect(xhr.response.statusCode).to.equal(201);
      });

      cy.get('.master-work').should('have.length', 1);
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    // click on works
    cy.get('.profile__cards > :nth-child(3) > img').click();
    cy.get('.master-works').then(($element) => {
      // get current length of works(including add-button)
      const initialChildrenLength = $element.children().length;
      // click on add work
      cy.get('.master-works__add-work').click();
      // click on upload image
      cy.get('.add-master-work__upload-input').attachFile('work.png');
      // add-title
      cy.get('#title').type(workTitle);
      // listen for request
      cy.intercept('/api/v1/master/**').as('addWork');
      // save
      cy.get('.btn--primary').click();
      // compare length
      cy.wait('@addWork').then((xhr) => {
        expect(xhr.response.statusCode).to.equal(201);
      });

      cy.get('.master-work').should('have.length', 1);
    });
  });
});
