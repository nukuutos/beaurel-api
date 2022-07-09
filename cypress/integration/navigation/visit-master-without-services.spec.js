describe('Visit a master without services', () => {
  beforeEach(() => {
    cy.task('db:addMasterWithoutServices');
    cy.task('db:addCustomer');
    // go to auth
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/test' });
  });

  it("Desktop, check master's cards", () => {
    // open booking
    cy.get('.profile__cards > :nth-child(1) > span > img').click();
    cy.get('.no-master-tools__text').contains('Невозможно записаться к мастеру');
    cy.get('.modal__close').click();
    // open services
    cy.get(':nth-child(2) > span > img').click();
    cy.get('.no-master-tools__text').contains('Невозможно записаться к мастеру');
    cy.get('.modal__close').click();
    // open masters
    cy.get('.profile__cards > :nth-child(3) > span > img').click();
    cy.get('.no-master-tools__text').contains('Работы мастера отсутствуют');
  });
});
