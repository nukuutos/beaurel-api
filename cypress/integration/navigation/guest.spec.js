const getWeekdayRU = () => {
  const date = new Date();
  let weekdayIndex = date.getDay();
  weekdayIndex -= 1;
  if (weekdayIndex < 0) weekdayIndex += 7;
  return weekdayIndex;
};

describe('Navigate as guest', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
  });

  it('Desktop, client side', () => {
    // sign-in
    cy.visit('/sign-in');
    cy.get('.sign-in__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/sign-in');
    // sign-up
    cy.get(':nth-child(2) > a').click();
    cy.get('.sign-up__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/sign-up');
    // search
    cy.get(':nth-child(3) > a').click();
    cy.get('.search__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/search');
    // forgot-password
    cy.visit('/sign-in');
    cy.get('.sign-in__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/sign-in');

    cy.get('.sign-in__forget-password').click();
    cy.url().should('include', '/forgot-password');
    cy.get('.sign-up__heading:contains("Введите номер телефона")', { timeout: 30000 }).should(
      'be.visible'
    );
  });

  it('Desktop, server side', () => {
    // sign-in
    cy.visit('/sign-in');
    cy.get('.sign-in__heading').should('be.visible');
    // sign-up
    cy.visit('/sign-up');
    cy.get('.sign-up__heading').should('be.visible');
    // search
    cy.visit('/search');
    cy.get('.search__heading').should('be.visible');
    // forgot-password
    cy.visit('/forgot-password');
    cy.get('.sign-up__heading:contains("Введите номер телефона")').should('be.visible');
  });

  it('Phone, side navigation', () => {
    cy.viewport(330, 500);

    cy.visit('/sign-in');
    cy.get('.sign-in__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/sign-in');
    // sign-up
    cy.get('.mobile-navbar__main > :nth-child(2) > a').click();
    cy.get('.sign-up__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/sign-up');
    // search
    cy.get('.mobile-navbar__main > :nth-child(3) > a').click();
    cy.get('.search__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/search');
    // forgot-password
    cy.visit('/sign-in');
    cy.get('.sign-in__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/sign-in');

    cy.get('.sign-in__forget-password').click();
    cy.url().should('include', '/forgot-password');
    cy.get('.sign-up__heading:contains("Введите номер телефона")', { timeout: 30000 }).should(
      'be.visible'
    );
  });

  it('Desktop, book appointment', () => {
    cy.task('db:addTimetable');
    cy.task('db:addService', 'услуга');

    cy.visit('/test');

    cy.intercept('GET', '/api/v1/master/**').as('getBookedAppointments');
    cy.get('.profile__cards > :nth-child(1) > span > img').click();
    cy.wait('@getBookedAppointments');

    cy.intercept('GET', '/api/v1/master/**').as('getServices');
    cy.get('.booking-timetable__appointment').first().click();
    cy.wait('@getServices');

    cy.get('.service').first().click();

    cy.get('.btn-text').contains('Зарегистрироваться').click();
    cy.url().should('include', '/sign-up');
    cy.get('.sign-up__heading', { timeout: 30000 }).should('be.visible');
  });

  it('Desktop, message to master', () => {
    cy.visit('/test');

    cy.get('.profile__about-btn').click();

    cy.get('.btn-text').contains('Зарегистрироваться').click();
    cy.url().should('include', '/sign-up');
    cy.get('.sign-up__heading', { timeout: 30000 }).should('be.visible');
  });
});
