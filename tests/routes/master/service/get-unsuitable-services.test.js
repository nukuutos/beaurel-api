const app = require('../../../../app');
const User = require('../../../../models/user');
const Service = require('../../../../models/service');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/get-unsuitable-services');
const controller = require('./controllers/get-unsuitable-services');

const master = require('../../../data/users/master');
const unsuitableServices = require('./data/unsuitable-services');
const { after, before } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/service/update';

const config = {
  routeParams: { masterId: master._id.toString() },
  template,
  method: 'get',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`GET ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
