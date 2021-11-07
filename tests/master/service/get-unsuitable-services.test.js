const app = require('../../../app');
const User = require('../../../models/user/user');
const Service = require('../../../models/service/service');

const ExtendedSupertest = require('../../extended-supertest');

const routeParams = require('./route-params/get-unsuitable-services');
const controller = require('./controllers/get-unsuitable-services');

const master = require('../../data/masters/master');
const unsuitableServices = require('../../data/services/unsuitable-services');
const { after, before } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/service/update';

const config = {
  routeParams: { masterId: master._id.toString() },
  template,
  method: 'get',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await Service.insertMany(unsuitableServices);
});

describe(`GET ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
