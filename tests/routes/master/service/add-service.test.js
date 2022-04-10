const app = require('../../../../app');
const User = require('../../../../models/user');
const Service = require('../../../../models/service');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/add-service');
const bodyFields = require('./body-fields/add-service');
const controller = require('./controllers/add-service');

const master = require('../../../data/users/master');
const services = require('../data/services');
const timetable = require('../data/auto-timetable');

const Timetable = require('../../../../models/timetable');
const { before, after } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/service';

const config = {
  routeParams: { masterId: master._id.toString() },
  template,
  method: 'post',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`POST ${template}`, () => {
  request.testBodyFields(bodyFields).testRouteParams(routeParams).testController(controller);
});

after();
