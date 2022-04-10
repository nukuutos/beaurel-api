const app = require('../../../../app');
const User = require('../../../../models/user');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/get-city-and-timezone');
const controller = require('./controllers/get-city-and-timezone');

const master = require('../../../data/users/master');
const { before, after } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/profile/:profileId/city';

const config = {
  routeParams: { profileId: master._id.toString() },
  template,
  method: 'get',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe('GET /profile/:profileId/city', () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
