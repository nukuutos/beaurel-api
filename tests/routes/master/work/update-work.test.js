const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const bodyFields = require('./body-fields/update-work');
const routeParams = require('./route-params/update-work');
const controller = require('./controllers/update-work');

const master = require('../../../data/users/master');
const works = require('./data/works');
const { before, after } = require('../../../utils/endpoint-test-preparation');
const cleanUpBucket = require('../../../utils/clean-up-bucket');

const template = `/api/v1/master/:masterId/work/:workId`;

const config = {
  template,
  routeParams: { masterId: master._id.toString(), workId: works[0]._id.toString() },
  method: 'put',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => await cleanUpBucket());

describe(`PUT ${template}`, () => {
  request.testRouteParams(routeParams).testBodyFields(bodyFields).testController(controller);
});

after(async () => await cleanUpBucket());
