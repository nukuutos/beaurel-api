describe('Navigate as master without services', () => {
  beforeEach(() => {
    cy.task('db:addMasterWithoutServices');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
  });

  it("Desktop, check master's cards", () => {
    cy.get('.no-master-tools').should('be.visible');
    cy.get('.modal__close').click();
    // open booking
    cy.get('.profile__cards > :nth-child(1) > span > img').click();
    cy.get('.btn-text:contains("Создать услуги")').should('be.visible');
    cy.get('.modal__close').click();
    // // open services
    cy.get(':nth-child(2) > span > img').click();
    cy.get('.btn-text:contains("Создать услуги")').should('be.visible');
    cy.get('.modal__close').click();
    // // open masters
    cy.get('.profile__cards > :nth-child(3) > span > img').click();
    cy.get('.master-works__add-work').should('be.visible');
  });

  it('Desktop, client side navigation', () => {
    cy.get('.profile__identity').should('be.visible');
    cy.get('.no-master-tools').should('be.visible');
    cy.get('.modal__close').click();
    // search
    cy.get(':nth-child(2) > a').click();
    cy.get('.search__heading').should('be.visible');
    cy.url().should('include', '/search');
    cy.get('.no-master-tools').should('not.exist');
  });

  it('Desktop, server side navigation', () => {
    cy.get('.profile__identity').should('be.visible');
    cy.url().should('include', '/test');
    cy.get('.no-master-tools').should('be.visible');
    // search
    cy.authVisit({ identificator: 'test', password: '123456', page: '/search' });
    cy.get('.search__heading').should('be.visible');
    cy.get('.no-master-tools').should('be.visible');

    // appointments
    cy.authVisit({ identificator: 'test', password: '123456', page: '/appointments' });
    cy.get('.appointments__controller').should('be.visible');
    cy.get('.no-master-tools').should('be.visible');

    // messages
    cy.authVisit({ identificator: 'test', password: '123456', page: '/messages' });
    cy.get('.messages__header').should('be.visible');
    cy.get('.no-master-tools').should('be.visible');

    // services
    cy.authVisit({ identificator: 'test', password: '123456', page: '/services' });
    cy.get('.services__heading').should('be.visible');
    cy.get('.no-master-tools.card').should('not.exist');
    cy.get('.btn-text:contains("Добавить услугу")').should('be.visible');

    // timetable
    cy.authVisit({ identificator: 'test', password: '123456', page: '/timetable' });
    cy.get('.no-master-tools').should('be.visible');

    // masters
    cy.authVisit({ identificator: 'test', password: '123456', page: '/masters' });
    cy.get('.masters__heading').should('be.visible');
    cy.get('.no-master-tools').should('be.visible');

    // settings
    cy.authVisit({ identificator: 'test', password: '123456', page: '/settings' });
    cy.get('.settings__heading').should('be.visible');
    cy.get('.no-master-tools').should('be.visible');
  });
});
