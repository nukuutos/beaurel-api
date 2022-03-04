const app = require('../../../app');
const User = require('../../../models/user');

const ExtendedSupertest = require('../../extended-supertest');
const controller = require('./controllers/get-favorites');

const master = require('../../data/masters/master');
const master1 = require('../../data/masters/master-1');
const master2 = require('../../data/masters/master-2');

const routeParams = require('./route-params/get-favorites');
const queryParams = require('./query-params/get-favorites');
const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/profile/:profileId/favorite';

const config = {
  template,
  routeParams: { profileId: master._id.toString() },
  method: 'get',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.insertMany([master, master1, master2]);
});

describe(`GET ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller).testQueryParams(queryParams);
});

after();
