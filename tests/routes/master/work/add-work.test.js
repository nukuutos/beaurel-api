const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const bodyFields = require('./body-fields/add-work');
const routeParams = require('./route-params/add-work');
const controller = require('./controllers/add-work');

const master = require('../../../data/users/master');
const { before, after } = require('../../../utils/endpoint-test-preparation');
const cleanUpBucket = require('../../../utils/clean-up-bucket');

const template = `/api/v1/master/:masterId/work`;

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'post',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => await cleanUpBucket());

describe(`POST ${template}`, () => {
  request.testRouteParams(routeParams).testBodyFields(bodyFields).testController(controller);
});

after(async () => await cleanUpBucket());
