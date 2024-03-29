const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');
const controller = require('./controllers/update-avatar');

const master = require('../../../data/users/master');
const routeParams = require('./route-params/update-avatar');
const { before, after } = require('../../../utils/endpoint-test-preparation');
const cleanUpBucket = require('../../../utils/clean-up-bucket');

const template = '/api/v1/profile/:profileId/avatar';

const config = {
  template,
  routeParams: { profileId: master._id.toString() },
  method: 'put',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => await cleanUpBucket());

describe(`PUT ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after(async () => await cleanUpBucket());
