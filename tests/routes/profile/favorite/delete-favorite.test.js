const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const master = require('../../../data/users/master');
const master2 = require('../../../data/users/master-2');

const routeParams = require('./route-params/delete-favorite');
const controller = require('./controllers/delete-favorite/delete-favorite');
const { before, after } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/profile/:profileId/favorite/:masterId';

const config = {
  template,
  routeParams: { profileId: master._id.toString(), masterId: master2._id.toString() },
  method: 'delete',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`DELETE ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
