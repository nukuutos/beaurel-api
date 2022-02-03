const ExtendedSupertest = require('../../../extended-supertest');
const app = require('../../../../app');

const routeParams = require('./route-params/update-viewed-state');
const controller = require('./controllers/update-viewed-state');
const bodyFields = require('./body-fields/update-viewed-state');

const master = require('../../../data/masters/master');
const appointment = require('../../../data/appointments/appointment-for-viewed-state');

const { before, after } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/appointment/:appointmentId/viewed-state';

const config = {
  routeParams: {
    masterId: master._id.toString(),
    appointmentId: appointment._id.toString(),
  },
  template,
  method: 'put',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`PUT ${template}`, () => {
  request.testController(controller).testBodyFields(bodyFields).testRouteParams(routeParams);
});

after();
