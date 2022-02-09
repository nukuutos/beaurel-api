const app = require('../../../app');

const ExtendedSupertest = require('../../extended-supertest');

const master = require('../../data/masters/master');

const controller = require('./controllers/get-online-status');
const routeParams = require('./route-params/get-online-status');

const { after, before } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/profile/:profileId/online';

const config = {
  template,
  routeParams: { profileId: master._id.toString() },
  method: 'get',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`GET ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
