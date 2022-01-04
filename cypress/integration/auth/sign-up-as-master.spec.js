describe('Sign up as master', () => {
  beforeEach(() => {
    cy.visit('/sign-up');
    cy.get('.sign-up', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    // master-case
    cy.get('.sign-up__choice-cards > :nth-child(2)').click();
    cy.get('.btn').click();
    // specialization
    cy.get('.input').select(1);
    cy.get('.sign-up__btn').click();
    // names
    cy.get('#firstName').type('Тест');
    cy.get('#lastName').type('Тестов');
    cy.get('.btn').click();
    // passwords
    cy.get('#password').type('123456');
    cy.get('#confirmedPassword').type('123456');
    cy.get('.btn').click();
    //  phone
    cy.get('#phone').type('9999999999');
    cy.intercept('POST', '/api/v1/auth/**').as('sendUserData');
    cy.get('.btn').click();
    cy.wait('@sendUserData');
    // get resend button
    cy.intercept('POST', '/api/v1/auth/**').as('resendCode');
    cy.get('.btn-text', { timeout: 80000 }).should('be.visible').click();
    cy.get('.sign-up__time').should('be.visible');
    cy.wait('@resendCode');
    // verification code
    cy.task('db:getVerificationCode').then((code) => {
      cy.get('#first').type(code);
      cy.intercept('POST', '/api/v1/auth/**').as('confirmAccount');
      cy.get('.btn').click();
      cy.wait('@confirmAccount');
    });

    cy.get('.profile__identify', { timeout: 60000 }).should('be.visible');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    // master-case
    cy.get('.sign-up__choice-cards > :nth-child(2)').click();
    cy.get('.btn').click();
    // specialization
    cy.get('.input').select(1);
    cy.get('.sign-up__btn').click();
    // names
    cy.get('#firstName').type('Тест');
    cy.get('#lastName').type('Тестов');
    cy.get('.btn').click();
    // passwords
    cy.get('#password').type('123456');
    cy.get('#confirmedPassword').type('123456');
    cy.get('.btn').click();
    //  phone
    cy.get('#phone').type('9999999999');
    cy.intercept('POST', '/api/v1/auth/**').as('sendUserData');
    cy.get('.btn').click();
    cy.wait('@sendUserData');

    // verification code
    cy.task('db:getVerificationCode').then((code) => {
      cy.get('#first').type(code);
      cy.intercept('POST', '/api/v1/auth/**').as('confirmAccount');
      cy.get('.btn').click();
      cy.wait('@confirmAccount');
    });

    cy.get('.profile__identify', { timeout: 60000 }).should('be.visible');
  });
});
