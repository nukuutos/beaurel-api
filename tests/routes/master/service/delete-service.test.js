const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/delete-service');
const controller = require('./controllers/delete-service');

const master = require('../../../data/users/master');
const services = require('../data/services');

const { after, before } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/service/:serviceId';

const config = {
  routeParams: { masterId: master._id.toString(), serviceId: services[0]._id.toString() },
  template,
  method: 'delete',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`DELETE ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
