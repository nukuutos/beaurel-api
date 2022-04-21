describe('Get masters by scroll', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    cy.task('db:addMasters');
    // set city
    localStorage.setItem('city', 'Владивосток');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/search' });
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
