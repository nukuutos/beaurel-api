const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const master = require('../../../data/users/master');

const routeParams = require('./route-params/get-dialog');
const controller = require('./controllers/get-dialog');
const queryParams = require('./query-params/get-dialog');

const { before, after } = require('../../../utils/endpoint-test-preparation');
const master1 = require('../../../data/users/master-1');

const template = '/api/v1/profile/:profileId/message/:interlocutorId';

const config = {
  template,
  routeParams: { profileId: master._id.toString(), interlocutorId: master1._id.toString() },
  method: 'get',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`GET ${template}`, () => {
  request.testRouteParams(routeParams).testQueryParams(queryParams).testController(controller);
});

after();
