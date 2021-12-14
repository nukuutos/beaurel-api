describe('Get masters by scroll', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addMasters');
    // go to auth
    cy.auth('test@test.com', '123456');
    // go to search
    cy.get(':nth-child(2) > a').click();
    cy.get('.search__heading', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.get('.content').then(($content) => {
      const currentChildren = $content.children();

      cy.intercept('/api/v1/master**').as('getMasters');
      cy.window().scrollTo('bottom');
      cy.wait('@getMasters');

      cy.wrap($content).then(($content) => {
        const nextChildren = $content.children();
        expect(currentChildren.length).to.be.lessThan(nextChildren.length);
      });
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('.content').then(($content) => {
      const currentChildren = $content.children();

      cy.intercept('/api/v1/master**').as('getMasters');
      cy.window().scrollTo('bottom');
      cy.wait('@getMasters');

      cy.wrap($content).then(($content) => {
        const nextChildren = $content.children();
        expect(currentChildren.length).to.be.lessThan(nextChildren.length);
      });
    });
  });
});
