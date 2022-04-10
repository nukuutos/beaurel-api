const app = require('../../../../app');
const User = require('../../../../models/user');
const Service = require('../../../../models/service');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/put-update-to-services');
const bodyFields = require('./body-fields/put-update-to-services');
const controller = require('./controllers/put-update-to-services/put-update-to-services');

const master = require('../../../data/users/master');
const unsuitableServices = require('./data/unsuitable-services');
const timetableWithUpdate = require('../data/auto-timetable-with-update');

const Timetable = require('../../../../models/timetable');
const { before, after } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/service/update';

const config = {
  routeParams: { masterId: master._id.toString() },
  template,
  method: 'put',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`PUT ${template}`, () => {
  request.testBodyFields(bodyFields).testRouteParams(routeParams).testController(controller);
});

after();
