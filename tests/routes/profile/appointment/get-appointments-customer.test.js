const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const customer = require('../../../data/users/customer');

const queryParams = require('./query-params/get-appointments-customer');
const routeParams = require('./route-params/get-appointments-customer');
const controller = require('./controllers/get-appointments-customer');

const { before, after } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/profile/:profileId/appointment/customer';

const config = {
  template,
  routeParams: { profileId: customer._id.toString() },
  method: 'get',
  user: customer,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`GET ${template}`, () => {
  request.testRouteParams(routeParams).testQueryParams(queryParams).testController(controller);
});

after();
