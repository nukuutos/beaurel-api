const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');
const controller = require('./controllers/get-favorites');

const master = require('../../../data/users/master');

const routeParams = require('./route-params/get-favorites');
const queryParams = require('./query-params/get-favorites');
const { before, after } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/profile/:profileId/favorite';

const config = {
  template,
  routeParams: { profileId: master._id.toString() },
  method: 'get',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`GET ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller).testQueryParams(queryParams);
});

after();
