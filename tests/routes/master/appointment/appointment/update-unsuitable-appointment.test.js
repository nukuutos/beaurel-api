const ExtendedSupertest = require('../../../../extended-supertest');
const app = require('../../../../../app');

const User = require('../../../../../models/user');

const bodyFields = require('./body-fields/update-unsuitable-appointment');
const routeParams = require('./route-params/update-unsuitable-appointment');
const controller = require('./controllers/update-unsuitable-appointment');

const master = require('../../../../data/users/master');
const unsuitableAppointment = require('./data/unsuitable-appointment');

const { before, after } = require('../../../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/appointment/:appointmentId/unsuitable';

const config = {
  routeParams: {
    masterId: master._id.toString(),
    appointmentId: unsuitableAppointment._id.toString(),
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
