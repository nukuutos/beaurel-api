const app = require('../../../app');

const ExtendedSupertest = require('../../extended-supertest');

const controller = require('./controllers/get-customer-data');
const routeParams = require('./route-params/get-customer-data');

const { after, before } = require('../../utils/endpoint-test-preparation');

const customer = require('../../data/masters/customer');

const template = '/api/v1/profile/:profileId/';

const config = {
  template,
  routeParams: { profileId: customer._id.toString() },
  method: 'get',
  user: customer,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`GET ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
