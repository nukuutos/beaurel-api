const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/delete-sub-service');
const controller = require('./controllers/delete-sub-service');

const master = require('../../../data/users/master');
const serviceParameter = require('./data/service-parameter');

const { before, after } = require('../../../utils/endpoint-test-preparation');

const subService = serviceParameter[0];
const { title, _id } = subService;

const template = '/api/v1/master/:masterId/service-parameter/:titleId/sub-service/:subServiceId';

const config = {
  template,
  routeParams: { masterId: master._id.toString(), titleId: title, subServiceId: _id.toString() },
  method: 'delete',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`DELETE ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
