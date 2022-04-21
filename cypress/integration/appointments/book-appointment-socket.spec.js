const serviceId = '6121fc9f8fce2120cc841b6c';
const masterId = '5eb849b81c2ccc21306ced34';

describe('Book appointment socket', () => {
  beforeEach(() => {
    cy.task('db:bookAppointmentSocket');
    // cy.task('db:addMaster');
    // cy.task('db:addTimetable');
    // cy.task('db:addService', 'service');
    // cy.task('db:addCustomer');
    // go to auth
    cy.authVisit({ identificator: 'test', password: '123456', page: '/test' });
    cy.get('.profile__header', { timeout: 60000 }).should('be.visible');
  });

  it('Desktop', () => {
    cy.task('request:bookAppointment', {
      user: { identificator: 'test1', password: '123456' },
      appointment: {
        serviceId,
        time: { startAt: 600, endAt: 720 },
        date: '2023-12-25T00:00:00.000Z',
      },
    }).then(() => {
      cy.getCookie('refreshToken');
      cy.get('.navbar__link--notification', { timeout: 60000 }).should('be.visible').click();
      cy.get('.appointments__appointment-card', { timeout: 60000 }).should('be.visible');

      cy.task('request:bookAppointment', {
        user: { identificator: 'test1', password: '123456' },
        appointment: {
          serviceId,
          time: { startAt: 720, endAt: 840 },
          date: '2023-12-25T00:00:00.000Z',
        },
      });
    });
  });

  it('Phone', () => {
    cy.viewport(330, 500);
    // check appointment as customer
    cy.task('request:bookAppointment', {
      user: { identificator: 'test1', password: '123456' },
      appointment: {
        serviceId,
        time: { startAt: 600, endAt: 720 },
        date: '2023-12-25T00:00:00.000Z',
      },
    }).then(() => {
      cy.get('.mobile-navbar__item--notification', { timeout: 60000 }).should('be.visible').click();
      cy.get('.appointments__appointment-card', { timeout: 60000 }).should('be.visible');

      cy.task('request:bookAppointment', {
        user: { identificator: 'test1', password: '123456' },
        appointment: {
          serviceId,
          time: { startAt: 720, endAt: 840 },
          date: '2023-12-25T00:00:00.000Z',
        },
      });
    });
  });
});
