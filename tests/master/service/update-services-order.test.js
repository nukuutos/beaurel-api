const app = require('../../../app');
const User = require('../../../models/user/user');
const Service = require('../../../models/service/service');

const ExtendedSupertest = require('../../extended-supertest');

const routeParams = require('./route-params/update-services-order');
const bodyFields = require('./body-fields/update-services-order');
const controller = require('./controllers/update-services-order');

const master = require('../../data/masters/master');
const services = require('../../data/services/services');
const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/service/order';

const config = {
  routeParams: { masterId: master._id.toString() },
  template,
  method: 'patch',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await Service.insertMany(services);
});

describe(`PATCH ${template}`, () => {
  request.testBodyFields(bodyFields).testRouteParams(routeParams).testController(controller);
});

after();
