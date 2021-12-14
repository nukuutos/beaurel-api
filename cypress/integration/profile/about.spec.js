const { getRandomLength } = require('../../utils/methods');

const basicAboutText =
  'Lorem dolor sit amet consectetur adipisicing elit. Molestias sequi recusandae saepe, sunt optio provident repellat. Lorem ipsum dolor sit ameorib jkdf';

describe('Update about text', () => {
  beforeEach(() => {
    cy.task('db:addMaster');
    // go to auth
    cy.auth('test@test.com', '123456');
  });

  it('Desktop', () => {
    // get random about text
    const [start, end] = getRandomLength(0, 151);
    const aboutText = basicAboutText.slice(start, end).trim();

    // click on change about text
    cy.get('.profile__about > svg').click();

    // new about text
    cy.get('.edit-about__textarea').clear().type(aboutText);
    cy.intercept('/api/v1/profile/**').as('updateAboutText');

    // save it
    cy.get('.btn--primary').click();

    // check status code
    cy.wait('@updateAboutText').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });

    // check text
    cy.get('.profile__about').should(($element) => {
      const text = $element.text();
      expect(text).to.equal(aboutText);
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);
    // cy.wait(1000);

    cy.get('.navbar').should('not.be.visible');

    // get random about text
    const [start, end] = getRandomLength(0, 151);
    const aboutText = basicAboutText.slice(start, end).trim();

    // click on change about text
    cy.get('.profile__about > .svg-inline--fa').click({ force: true });

    // new about text
    cy.get('.edit-about__textarea').clear().type(aboutText);
    cy.intercept('/api/v1/profile/**').as('updateAboutText');

    // save it
    cy.get('.btn--primary').click();

    // check status code
    cy.wait('@updateAboutText').then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });

    // check text
    cy.get('.profile__about').should(($element) => {
      const text = $element.text();
      expect(text).to.equal(aboutText);
    });
  });
});
