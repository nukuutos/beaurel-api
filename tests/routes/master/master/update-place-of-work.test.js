const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/update-place-of-work');
const bodyFields = require('./body-fields/update-place-of-work');
const controller = require('./controllers/update-place-of-work/update-place-of-work');

const { after, before } = require('../../../utils/endpoint-test-preparation');
const master = require('../../../data/users/master');

const template = '/api/v1/master/:masterId/place-of-work';

const config = {
  template,
  method: 'put',
  routeParams: { masterId: master._id.toString() },
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`PUT ${template}`, () => {
  request.testRouteParams(routeParams).testBodyFields(bodyFields).testController(controller);
});

after();
