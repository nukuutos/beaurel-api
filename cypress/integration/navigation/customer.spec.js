describe('Navigate as customer', () => {
  beforeEach(() => {
    cy.task('db:addCustomer');
    cy.task('db:addTimetable');
    // go to auth
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/test1' });
  });

  it('Desktop, client side', () => {
    cy.get('.profile__identity', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/test1');
    // search
    cy.get(':nth-child(2) > a').click();
    cy.get('.search__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/search');
    // appointments
    cy.get(':nth-child(3) > a').click();
    cy.get('.appointments__appointment-types', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/appointments');
    // messages
    cy.get(':nth-child(4) > a').click();
    cy.get('.messages__header', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/messages');
    // masters
    cy.get(':nth-child(5) > a').click();
    cy.get('.masters__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/masters');
    // settings
    cy.get(':nth-child(6) > a').click();
    cy.get('.settings__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/settings');
  });

  it('Desktop, server side', () => {
    cy.get('.profile__identity', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/test1');
    // search
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/search' });
    cy.get('.search__heading', { timeout: 30000 }).should('be.visible');
    // appointments
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/appointments' });
    cy.get('.appointments__appointment-types', { timeout: 30000 }).should('be.visible');
    // messages
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/messages' });
    cy.get('.messages__header', { timeout: 30000 }).should('be.visible');
    // masters
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/masters' });
    cy.get('.masters__heading', { timeout: 30000 }).should('be.visible');
    // settings
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/settings' });
    cy.get('.settings__heading', { timeout: 30000 }).should('be.visible');
  });

  it('Desktop, server side notifications', () => {
    cy.task('db:addMaster');
    cy.task('db:addConfirmedAppointmentCustomer');
    cy.task('db:addUnreadMessageForCustomer');

    cy.authVisit({ identificator: 'test1', password: '123456', page: '/search' });
    cy.get('.search__heading', { timeout: 30000 }).should('be.visible');
    cy.get('.navbar__link--notification').should('have.length', 2);
    // appointments
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/appointments' });
    cy.get('.appointments__appointment-types', { timeout: 30000 }).should('be.visible');
    cy.get('.navbar__link--notification').should('have.length', 2);
    // messages
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/messages' });
    cy.get('.messages__header', { timeout: 30000 }).should('be.visible');
    cy.get('.navbar__link--notification').should('have.length', 2);
    // masters
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/masters' });
    cy.get('.masters__heading', { timeout: 30000 }).should('be.visible');
    cy.get('.navbar__link--notification').should('have.length', 2);
    // settings
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/settings' });
    cy.get('.settings__heading', { timeout: 30000 }).should('be.visible');
    cy.get('.navbar__link--notification').should('have.length', 2);
    // profile
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/test1' });
    cy.get('.profile__identity', { timeout: 30000 }).should('be.visible');
    cy.get('.navbar__link--notification').should('have.length', 2);
  });

  it('Phone, main navigation', () => {
    cy.viewport(330, 500);
    // main nav
    cy.get('.profile__identity', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/test1');
    // search
    cy.get('.mobile-navbar__item--menu').click();
    cy.get('.navbar__list > :nth-child(2) > a').click();
    cy.get('.search__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/search');
    // appointments
    cy.get('.mobile-navbar__item--menu').click();
    cy.get('.navbar__list > :nth-child(3) > a').click();
    cy.get('.appointments__appointment-types', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/appointments');
    // messages
    cy.get('.mobile-navbar__item--menu').click();
    cy.get('.navbar__list > :nth-child(4) > a').click();
    cy.get('.messages__header', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/messages');
    // masters
    cy.get('.mobile-navbar__item--menu').click();
    cy.get(':nth-child(5) > a').click();
    cy.get('.masters__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/masters');
    // settings
    cy.get('.mobile-navbar__item--menu').click();
    cy.get('.navbar__list > :nth-child(6) > a').click();
    cy.get('.settings__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/settings');
  });

  it('Phone, side navigation', () => {
    cy.viewport(330, 500);
    // main nav
    cy.get('.profile__identity', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/test1');
    // appointments
    cy.get('.mobile-navbar__main > :nth-child(2) > a').click();
    cy.get('.appointments__appointment-types', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/appointments');
    // messages
    cy.get('.mobile-navbar__main > :nth-child(3) > a').click();
    cy.get('.messages__header', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/messages');
    // masters
    cy.get('.mobile-navbar__main > :nth-child(4) > a').click();
    cy.get('.masters__heading', { timeout: 30000 }).should('be.visible');
    cy.url().should('include', '/masters');
  });
});
