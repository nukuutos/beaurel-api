describe('Update avatar', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
    cy.get('.profile__cards', { timeout: 60000 }).should('be.visible');
  });

  afterEach(() => {
    cy.task('fs:deleteAvatar');
  });

  it('Desktop', () => {
    // click on change avatar
    cy.get(
      '#__next > div:nth-child(1) > main > header > div:nth-child(1) > div:nth-child(1) > div'
    ).click();

    // new avatar
    cy.get('.select__input').attachFile('avatar.jpg');
    cy.get('.cropper-face').should('be.visible');

    cy.intercept('/api/v1/profile/**').as('updateAvatar');
    // save it
    cy.get('.btn--primary').click();

    // check status code
    cy.wait('@updateAvatar').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    // click on change avatar
    cy.get(
      '#__next > div:nth-child(1) > main > header > div:nth-child(1) > div:nth-child(1) > div'
    ).click();

    // new avatar
    cy.get('.select__input').attachFile('avatar.jpg');
    cy.get('.cropper-face').should('be.visible');

    cy.intercept('/api/v1/profile/**').as('updateAvatar');
    // save it
    cy.get('.btn--primary').click();

    // check status code
    cy.wait('@updateAvatar').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });
  });
});
