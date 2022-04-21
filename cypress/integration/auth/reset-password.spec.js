describe('Reset password', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.visit('/forgot-password');
    cy.get('.sign-up > .logo', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    const newPassword = '1234567';

    cy.get('#phone').type('9999999999');
    cy.intercept('/api/v1/auth/**').as('startResetPassword');
    cy.get('.btn').click();
    cy.wait('@startResetPassword');

    // verification code
    cy.task('db:getResetPasswordVerificationCode').then((code) => {
      cy.get('#first').type(code);
      cy.get('.btn').click();
    });

    cy.get('#newPassword').type(newPassword);
    cy.get('#newConfirmedPassword').type(newPassword);

    cy.intercept('PUT', '/api/v1/auth/**').as('changePassword');
    cy.get('.btn').click();
    cy.wait('@changePassword');

    cy.get('.forgot-password__link').click();
    cy.url().should('include', '/sign-in');
    cy.get('#identificator', { timeout: 60000 }).should('be.visible').type('test');
    cy.get('#password').type(newPassword);
    cy.intercept('/api/v1/auth/**').as('signIn');
    cy.get('.btn--primary').click();
    cy.wait('@signIn');
    cy.url().should('include', '/test');
    cy.get('.profile__header', { timeout: 60000 }).should('be.visible');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    const newPassword = '1234567';

    cy.get('#phone').type('9999999999');
    cy.intercept('/api/v1/auth/**').as('startResetPassword');
    cy.get('.btn').click();
    cy.wait('@startResetPassword');

    // verification code
    cy.task('db:getResetPasswordVerificationCode').then((code) => {
      cy.get('#first').type(code);
      cy.get('.btn').click();
    });

    cy.get('#newPassword').type(newPassword);
    cy.get('#newConfirmedPassword').type(newPassword);

    cy.intercept('PUT', '/api/v1/auth/**').as('changePassword');
    cy.get('.btn').click();
    cy.wait('@changePassword');

    cy.get('.forgot-password__link').click();
    cy.url().should('include', '/sign-in');
    cy.get('#identificator', { timeout: 60000 }).should('be.visible').type('test');
    cy.get('#password').type(newPassword);
    cy.intercept('/api/v1/auth/**').as('signIn');
    cy.get('.btn--primary').click();
    cy.wait('@signIn');
    cy.url().should('include', '/test');
    cy.get('.profile__header', { timeout: 60000 }).should('be.visible');
  });
});
