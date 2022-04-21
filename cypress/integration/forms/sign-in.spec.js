describe('Sign in form', () => {
  beforeEach(() => {
    cy.visit('sign-in');
  });

  it('Desktop', () => {
    cy.get('#identificator').type('something');
    cy.get('#password').type('something');
    cy.intercept('POST', '/api/v1/auth/**').as('login');
    cy.get('.btn--primary').click();
    cy.wait('@login');

    cy.get('.alert').contains('Неправильный индентификатор или пароль!');
  });

  it('Phone', () => {
    cy.viewport(330, 500);

    cy.get('#identificator').type('something');
    cy.get('#password').type('something');
    cy.intercept('POST', '/api/v1/auth/**').as('login');
    cy.get('.btn--primary').click();
    cy.wait('@login');

    cy.get('.alert').contains('Неправильный индентификатор или пароль!');
  });
});
