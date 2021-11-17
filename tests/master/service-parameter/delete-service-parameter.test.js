const app = require('../../../app');
const User = require('../../../models/user');

const ExtendedSupertest = require('../../extended-supertest');

const routeParams = require('./route-params/delete-service-parameter');
const controller = require('./controllers/delete-service-parameter');

const master = require('../../data/masters/master');
const serviceParameter = require('../../data/services/service-parameter');

const ServiceParameter = require('../../../models/service-parameter');
const { after, before } = require('../../utils/endpoint-test-preparation');

const subService = serviceParameter[0];
const { title } = subService;

const template = '/api/v1/master/:masterId/service-parameter/:titleId';

const config = {
  template,
  routeParams: { masterId: master._id.toString(), titleId: title },
  method: 'delete',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await ServiceParameter.insertMany(serviceParameter);
});

describe(`DELETE ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
