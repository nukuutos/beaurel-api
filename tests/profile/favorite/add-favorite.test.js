const app = require('../../../app');
const User = require('../../../models/user/user');

const ExtendedSupertest = require('../../extended-supertest');

const master = require('../../data/masters/master');
const master1 = require('../../data/masters/master-1');
const master2 = require('../../data/masters/master-2');
const master3 = require('../../data/masters/master-3');

const routeParams = require('./route-params/add-favorite');
const controller = require('./controllers/add-favorite');
const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/profile/:profileId/favorite/:masterId';

const config = {
  template,
  routeParams: { profileId: master._id.toString(), masterId: master3._id.toString() },
  method: 'post',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.insertMany([master, master1, master2, master3]);
});

describe(`POST ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
