describe('Visit a master without tools', () => {
  beforeEach(() => {
    cy.task('db:addMasterBeginner');
    cy.task('db:addCustomer');
    // go to auth
    cy.authVisit({ identificator: 'test1', password: '123456', page: '/test' });
  });

  it("Desktop, check master's cards", () => {
    // open booking
    cy.get('.profile__cards > :nth-child(1) > img').click();
    cy.get('.no-master-tools__text').contains('Невозможно записаться к мастеру');
    cy.get('.fa-times > path').click();
    // open services
    cy.get('.profile__cards > :nth-child(2) > img').click();
    cy.get('.no-master-tools__text').contains('Невозможно записаться к мастеру');
    cy.get('.fa-times > path').click();
    // open masters
    cy.get('.profile__cards > :nth-child(3) > img').click();
    cy.get('.no-master-tools__text').contains('Работы мастера отсутствуют');
  });
});
