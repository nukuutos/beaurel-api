const app = require('../../../app');
const User = require('../../../models/user');

const ExtendedSupertest = require('../../extended-supertest');
const controller = require('./controllers/update-avatar');

const master = require('../../data/masters/master');
const routeParams = require('./route-params/update-avatar');
const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/profile/:profileId/avatar';

const config = {
  template,
  routeParams: { profileId: master._id.toString() },
  method: 'put',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
});

describe(`PUT ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
