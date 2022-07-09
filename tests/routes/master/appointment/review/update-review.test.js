const app = require('../../../../../app');

const ExtendedSupertest = require('../../../../extended-supertest');

const routeParams = require('./route-params/update-review');
const bodyFields = require('./body-fields/update-review');
const controller = require('./controllers/update-review');

const master = require('../../../../data/users/master');
const appointments = require('../data/appointments');
const master1 = require('../../../../data/users/master-1');
const { before, after } = require('../../../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/appointment/:appointmentId/review';

const config = {
  routeParams: { masterId: master._id.toString(), appointmentId: appointments[0]._id.toString() },
  template,
  method: 'put',
  user: master1,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`PUT ${template}`, () => {
  request.testBodyFields(bodyFields).testRouteParams(routeParams).testController(controller);
});

after();
