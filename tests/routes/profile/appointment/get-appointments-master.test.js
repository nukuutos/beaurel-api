const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const master = require('../../../data/users/master');

const queryParams = require('./query-params/get-appointments-master');
const routeParams = require('./route-params/get-appointments-master');
const controller = require('./controllers/get-appointments-master');

const { before, after } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/profile/:profileId/appointment/master';

const config = {
  template,
  routeParams: { profileId: master._id.toString() },
  method: 'get',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`GET ${template}`, () => {
  request.testRouteParams(routeParams).testQueryParams(queryParams).testController(controller);
});

after();
