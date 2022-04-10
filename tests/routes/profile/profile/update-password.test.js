const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const bodyFields = require('./body-fields/update-password');
const routeParams = require('./route-params/update-password');
const controller = require('./controllers/update-password');

const master = require('../../../data/users/master');
const { before, after } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/profile/:profileId/password';

const config = {
  template,
  method: 'put',
  routeParams: { profileId: master._id.toString() },
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`PUT ${template}`, () => {
  request.testBodyFields(bodyFields).testRouteParams(routeParams).testController(controller);
});

after();
