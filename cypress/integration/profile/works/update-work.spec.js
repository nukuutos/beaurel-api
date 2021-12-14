const newWorkTitle = 'Новое название';

describe('Update Work', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addWork');
    cy.task('fs:addWork');
    cy.auth('test@test.com', '123456');
  });

  afterEach(() => {
    cy.task('fs:deleteWork');
  });

  it('Desktop', () => {
    // click on works
    cy.get('.profile__cards > :nth-child(3) > img').click();

    cy.intercept('/api/v1/master/**').as('updateWork');

    // update work
    cy.get('.master-work__title').then(($element) => {
      cy.wrap($element).click({ force: true });
      // click btn edit
      cy.get('.btn-icon.mr-2').click();
      // click on upload image
      cy.get('.add-master-work__upload-input').attachFile('work.png');
      // new work title
      cy.get('#title').clear().type(newWorkTitle);
      // save
      cy.get('.btn--primary').click();
    });

    cy.wait('@updateWork').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
      // close carousel view
      cy.get('.fa-times').click();

      const newTitleRegex = new RegExp(`^${newWorkTitle}$`);

      cy.get('.master-work__title').contains(newTitleRegex).should('exist');
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    // click on works
    cy.get('.profile__cards > :nth-child(3) > img').click();

    cy.intercept('/api/v1/master/**').as('updateWork');

    // update work
    cy.get('.master-work__title').then(($element) => {
      cy.wrap($element).click({ force: true });
      // click btn edit
      cy.get('.btn-icon.mr-2').click();
      // click on upload image
      cy.get('.add-master-work__upload-input').attachFile('work.png');
      // new work title
      cy.get('#title').clear().type(newWorkTitle);
      // save
      cy.get('.btn--primary').click();
    });

    cy.wait('@updateWork').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
      // close carousel view
      cy.get('.back-bar__main > .svg-inline--fa').click();

      const newTitleRegex = new RegExp(`^${newWorkTitle}$`);

      cy.get('.master-work__title').contains(newTitleRegex).should('exist');
    });
  });
});
