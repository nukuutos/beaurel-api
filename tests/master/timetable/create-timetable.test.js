const app = require('../../../app');

const ExtendedSupertest = require('../../extended-supertest');

const bodyFields = require('./body-fields/create-timetable');
const routeParams = require('./route-params/create-timetable');
const controller = require('./controllers/create-timetable');

const master = require('../../data/masters/master');
const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/timetable/';

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'post',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`POST ${template}`, () => {
  request.testBodyFields(bodyFields).testRouteParams(routeParams).testController(controller);
});

after();
