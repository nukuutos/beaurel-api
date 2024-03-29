const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/delete-service-parameter');
const controller = require('./controllers/delete-service-parameter');

const master = require('../../../data/users/master');
const serviceParameter = require('./data/service-parameter');

const { after, before } = require('../../../utils/endpoint-test-preparation');

const subService = serviceParameter[0];
const { title } = subService;

const template = '/api/v1/master/:masterId/service-parameter/:titleId';

const config = {
  template,
  routeParams: { masterId: master._id.toString(), titleId: title },
  method: 'delete',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`DELETE ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
