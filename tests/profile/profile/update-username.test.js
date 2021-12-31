const app = require('../../../app');
const User = require('../../../models/user');

const ExtendedSupertest = require('../../extended-supertest');
const bodyFields = require('./body-fields/update-username');
const controller = require('./controllers/update-username');

const master = require('../../data/masters/master');
const routeParams = require('./route-params/update-username');
const { after, before } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/profile/:profileId/username';

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
  request.testRouteParams(routeParams).testBodyFields(bodyFields).testController(controller);
});

after();
