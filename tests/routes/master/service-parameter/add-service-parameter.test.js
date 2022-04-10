const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/add-service-parameter');
const bodyFields = require('./body-fields/add-service-parameter');
const controller = require('./controllers/add-service-parameter');

const master = require('../../../data/users/master');

const { after, before } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/service-parameter';

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'post',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`POST ${template}`, () => {
  request.testBodyFields(bodyFields).testRouteParams(routeParams).testController(controller);
});

after();
