const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/get-services');
const controller = require('./controllers/get-services');

const master = require('../../../data/users/master');

const { after, before } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/service';

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'get',
};

const request = new ExtendedSupertest(app, config);

before();

describe(`GET ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
