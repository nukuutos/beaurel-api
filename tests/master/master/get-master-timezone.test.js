const app = require('../../../app');
const User = require('../../../models/user/user');

const ExtendedSupertest = require('../../extended-supertest');

const routeParams = require('./route-params/get-master-timezone');
const controller = require('./controllers/get-master-timezone');

const master = require('../../data/masters/master');
const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/timezone';

const config = {
  routeParams: { masterId: master._id.toString() },
  template,
  method: 'get',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
});

describe('GET /master/:masterId', () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
