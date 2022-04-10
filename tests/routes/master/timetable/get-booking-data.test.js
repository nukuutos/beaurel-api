const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/get-booking-data');
const controller = require('./controllers/get-booking-data/get-booking-data');

const master = require('../../../data/users/master');
const { before, after } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/timetable/booking';

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'get',
};

const request = new ExtendedSupertest(app, config);

before();

describe(`POST ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
