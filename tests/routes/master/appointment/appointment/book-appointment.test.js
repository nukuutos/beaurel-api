const ExtendedSupertest = require('../../../../extended-supertest');
const app = require('../../../../../app');

const User = require('../../../../../models/user');

const bodyFields = require('./body-fields/book-appointment');
const routeParams = require('./route-params/book-appointment');
const controller = require('./controllers/book-appointment');

const master = require('../../../../data/users/master');
const master1 = require('../../../../data/users/master-1');
const { before, after } = require('../../../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/appointment';

const config = {
  routeParams: { masterId: master._id.toString() },
  template,
  method: 'post',
  user: master1,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`POST ${template}`, () => {
  request.testController(controller).testBodyFields(bodyFields).testRouteParams(routeParams);
});

after();
