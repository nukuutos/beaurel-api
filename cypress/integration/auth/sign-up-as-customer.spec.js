describe('Sign up as customer', () => {
  beforeEach(() => {
    cy.visit('/sign-up');
    cy.get('.sign-up', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    const name = 'Тест';
    const surname = 'Тестов';
    const city = 'Абакан';

    // customer-case
    cy.get('.sign-up__choice-cards > :nth-child(2)').click();
    cy.get('.btn').click();
    // names
    cy.get('#firstName').type(name);
    cy.get('#lastName').type(surname);
    cy.get('.btn').click();
    // passwords
    cy.get('#password').type('123456');
    cy.get('#confirmedPassword').type('123456');
    cy.get('.btn').click();
    // city
    cy.intercept('GET', '/api/v1/timezone/**').as('getCities');
    cy.get('.sign-up__input--city').click();
    cy.wait('@getCities');
    cy.get('.city-search > :nth-child(5)').click();
    cy.get('.current-city__value').contains(city);
    cy.get('.modal__close').click();
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

    cy.get('.profile__identity', { timeout: 60000 }).should('be.visible');
    cy.get('.profile__geolocation').contains(city);
    cy.get('.profile__name').contains(`${name} ${surname[0].toUpperCase()}.`);
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    const name = 'Тест';
    const surname = 'Тестов';
    const city = 'Абакан';

    // customer-case
    cy.get('.sign-up__choice-cards > :nth-child(2)').click();
    cy.get('.btn').click();
    // names
    cy.get('#firstName').type('Тест');
    cy.get('#lastName').type('Тестов');
    cy.get('.btn').click();
    // passwords
    cy.get('#password').type('123456');
    cy.get('#confirmedPassword').type('123456');
    cy.get('.btn').click();
    // city
    cy.intercept('GET', '/api/v1/timezone/**').as('getCities');
    cy.get('.sign-up__input--city').click();
    cy.wait('@getCities');
    cy.get('.city-search > :nth-child(5)').click();
    cy.get('.current-city__value').contains(city);
    cy.get('.back-bar__icon').click();
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

    cy.get('.profile__identity', { timeout: 60000 }).should('be.visible');
    cy.get('.profile__geolocation').contains(city);
    cy.get('.profile__name').contains(`${name} ${surname[0].toUpperCase()}.`);
  });
});
