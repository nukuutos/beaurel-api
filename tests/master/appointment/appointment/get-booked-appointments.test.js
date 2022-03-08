const ExtendedSupertest = require('../../../extended-supertest');
const app = require('../../../../app');

const routeParams = require('./route-params/get-booked-appointments');
const controller = require('./controllers/get-booked-appointments');

const master = require('../../../data/masters/master');
const { before, after } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/appointment';

const config = {
  routeParams: { masterId: master._id.toString() },
  template,
  method: 'get',
};

const request = new ExtendedSupertest(app, config);

before();

describe(`GET ${template}`, () => {
  request.testController(controller).testRouteParams(routeParams);
});

after();
