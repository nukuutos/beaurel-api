const app = require('../../../app');
const User = require('../../../models/user');

const ExtendedSupertest = require('../../extended-supertest');
const bodyFields = require('./body-fields/update-profile');
const controller = require('./controllers/update-profile');

const master = require('../../data/masters/master');
const routeParams = require('./route-params/update-profile');
const { after, before } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/profile/:profileId';

const config = {
  template,
  routeParams: { profileId: master._id.toString() },
  method: 'patch',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
});

describe(`PATCH ${template}`, () => {
  request.testRouteParams(routeParams).testBodyFields(bodyFields).testController(controller);
});

after();
