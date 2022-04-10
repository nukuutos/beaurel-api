const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/get-works');
const controller = require('./controllers/get-works');

const master = require('../../../data/users/master');
const { before, after } = require('../../../utils/endpoint-test-preparation');

const template = `/api/v1/master/:masterId/work`;

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'get',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`GET ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
