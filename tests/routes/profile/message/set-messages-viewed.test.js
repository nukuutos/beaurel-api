const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const master = require('../../../data/users/master');

const routeParams = require('./route-params/set-messages-viewed');
const controller = require('./controllers/set-messages-viewed');

const { before, after } = require('../../../utils/endpoint-test-preparation');
const master1 = require('../../../data/users/master-1');

const template = '/api/v1/profile/:profileId/message/:interlocutorId';

const config = {
  template,
  routeParams: { profileId: master._id.toString(), interlocutorId: master1._id.toString() },
  method: 'put',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`PUT ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
