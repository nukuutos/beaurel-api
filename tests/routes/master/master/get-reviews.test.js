const app = require('../../../../app');
const ExtendedSupertest = require('../../../extended-supertest');

const queryParams = require('./query-params/get-reviews');
const routeParams = require('./route-params/get-reviews');
const controller = require('./controllers/get-reviews/get-reviews');

const { after, before } = require('../../../utils/endpoint-test-preparation');
const master = require('../../../data/users/master');

const template = '/api/v1/master/:masterId/review';

const config = {
  template,
  method: 'get',
  routeParams: { masterId: master._id.toString() },
};

const request = new ExtendedSupertest(app, config);

before();

describe(`GET ${template}`, () => {
  request.testRouteParams(routeParams).testQueryParams(queryParams).testController(controller);
});

after();
