describe('Navigate as regular master', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addTimetable');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
  });

  it('Desktop, client side', () => {
    cy.get('.profile__identity', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/test');
    // search
    cy.get(':nth-child(2) > a').click();
    cy.get('.search__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/search');
    // appointments
    cy.get(':nth-child(3) > a').click();
    cy.get('.appointments__controller', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/appointments');
    // messages
    cy.get(':nth-child(4) > a').click();
    cy.get('.messages__header', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/messages');
    // services
    cy.get(':nth-child(5) > a').click();
    cy.get('.services__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/services');
    // timetable
    cy.get(':nth-child(6) > a').click();
    cy.get('.timetable__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/timetable');
    // masters
    cy.get(':nth-child(7) > a').click();
    cy.get('.masters__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/masters');
    // settings
    cy.get(':nth-child(8) > a').click();
    cy.get('.settings__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/settings');
  });

  it('Desktop, server side', () => {
    cy.get('.profile__identity', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/test');
    // search
    cy.authVisit({ identificator: 'test', password: '123456', page: '/search' });
    cy.get('.search__heading', { timeout: 30000 }).should('be.visible');
    // appointments
    cy.authVisit({ identificator: 'test', password: '123456', page: '/appointments' });
    cy.get('.appointments__controller', { timeout: 30000 }).should('be.visible');
    // messages
    cy.authVisit({ identificator: 'test', password: '123456', page: '/messages' });
    cy.get('.messages__header', { timeout: 30000 }).should('be.visible');
    // services
    cy.authVisit({ identificator: 'test', password: '123456', page: '/services' });
    cy.get('.services__heading', { timeout: 30000 }).should('be.visible');
    // timetable
    cy.authVisit({ identificator: 'test', password: '123456', page: '/timetable' });
    cy.get('.timetable__heading', { timeout: 30000 }).should('be.visible');
    // masters
    cy.authVisit({ identificator: 'test', password: '123456', page: '/masters' });
    cy.get('.masters__heading', { timeout: 30000 }).should('be.visible');
    // settings
    cy.authVisit({ identificator: 'test', password: '123456', page: '/settings' });
    cy.get('.settings__heading', { timeout: 30000 }).should('be.visible');
  });

  it('Desktop, server side notifications', () => {
    cy.task('db:addCustomer');
    cy.task('db:addConfirmedAppointmentCustomer');
    cy.task('db:addUnreadMessageForMaster');

    // search
    cy.authVisit({ identificator: 'test', password: '123456', page: '/search' });
    cy.get('.search__heading', { timeout: 30000 }).should('be.visible');
    cy.get('.navbar__link--notification').should('have.length', 2);
    // appointments
    cy.authVisit({ identificator: 'test', password: '123456', page: '/appointments' });
    cy.get('.appointments__controller', { timeout: 30000 }).should('be.visible');
    cy.get('.navbar__link--notification').should('have.length', 2);
    // messages
    cy.authVisit({ identificator: 'test', password: '123456', page: '/messages' });
    cy.get('.messages__header', { timeout: 30000 }).should('be.visible');
    cy.get('.navbar__link--notification').should('have.length', 2);
    // services
    cy.authVisit({ identificator: 'test', password: '123456', page: '/services' });
    cy.get('.services__heading', { timeout: 30000 }).should('be.visible');
    cy.get('.navbar__link--notification').should('have.length', 2);
    // timetable
    cy.authVisit({ identificator: 'test', password: '123456', page: '/timetable' });
    cy.get('.timetable__heading', { timeout: 30000 }).should('be.visible');
    cy.get('.navbar__link--notification').should('have.length', 2);
    // masters
    cy.authVisit({ identificator: 'test', password: '123456', page: '/masters' });
    cy.get('.masters__heading', { timeout: 30000 }).should('be.visible');
    cy.get('.navbar__link--notification').should('have.length', 2);
    // settings
    cy.authVisit({ identificator: 'test', password: '123456', page: '/settings' });
    cy.get('.settings__heading', { timeout: 30000 }).should('be.visible');
    cy.get('.navbar__link--notification').should('have.length', 2);
    // user id
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
    cy.get('.profile__identity', { timeout: 30000 }).should('be.visible');
    cy.get('.navbar__link--notification').should('have.length', 2);
  });

  it('Phone, main navigation', () => {
    cy.viewport(330, 500);
    // main nav
    cy.get('.profile__identity', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/test');
    // search
    cy.get('.mobile-navbar__item--menu').click();
    cy.get('.navbar > :nth-child(2) > a').click();
    cy.get('.search__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/search');
    // appointments
    cy.get('.mobile-navbar__item--menu').click();
    cy.get('.navbar > :nth-child(3) > a').click();
    cy.get('.appointments__controller', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/appointments');
    // messages
    cy.get('.mobile-navbar__item--menu').click();
    cy.get('.navbar > :nth-child(4) > a').click();
    cy.get('.messages__header', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/messages');
    // services
    cy.get('.mobile-navbar__item--menu').click();
    cy.get('.navbar > :nth-child(5) > a').click();
    cy.get('.services__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/services');
    // timetable
    cy.get('.mobile-navbar__item--menu').click();
    cy.get('.navbar > :nth-child(6) > a').click();
    cy.get('.timetable__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/timetable');
    // masters
    cy.get('.mobile-navbar__item--menu').click();
    cy.get('.navbar > :nth-child(7) > a').click();
    cy.get('.masters__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/masters');
    // settings
    cy.get('.mobile-navbar__item--menu').click();
    cy.get('.navbar > :nth-child(8) > a').click();
    cy.get('.settings__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/settings');
  });

  it('Phone, side navigation', () => {
    cy.viewport(330, 500);
    // main nav
    cy.get('.profile__identity', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/test');
    // appointments
    cy.get('.mobile-navbar__main > :nth-child(2) > a').click();
    cy.get('.appointments__controller', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/appointments');
    // messages
    cy.get('.mobile-navbar__main > :nth-child(3) > a').click();
    cy.get('.messages__header', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/messages');
    // timetable
    cy.get('.mobile-navbar__main > :nth-child(4) > a').click();
    cy.get('.timetable__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/timetable');
  });
});
