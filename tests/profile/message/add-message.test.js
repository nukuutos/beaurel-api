const app = require('../../../app');

const ExtendedSupertest = require('../../extended-supertest');

const master = require('../../data/masters/master');

const routeParams = require('./route-params/add-message');
const controller = require('./controllers/add-message');

const { before, after } = require('../../utils/endpoint-test-preparation');
const master1 = require('../../data/masters/master-1');

const template = '/api/v1/profile/:profileId/message/:recipientId';

const config = {
  template,
  routeParams: { profileId: master._id.toString(), recipientId: master1._id.toString() },
  method: 'post',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`POST ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
