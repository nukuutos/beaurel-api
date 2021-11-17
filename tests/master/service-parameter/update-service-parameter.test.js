const app = require('../../../app');
const User = require('../../../models/user');

const ExtendedSupertest = require('../../extended-supertest');

const routeParams = require('./route-params/update-service-parameter');
const bodyFields = require('./body-fields/update-service-parameter');
const controller = require('./controllers/update-service-parameter');

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
  method: 'put',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await ServiceParameter.insertMany(serviceParameter);
});

describe(`PUT ${template}`, () => {
  request.testBodyFields(bodyFields).testRouteParams(routeParams).testController(controller);
});

after();
