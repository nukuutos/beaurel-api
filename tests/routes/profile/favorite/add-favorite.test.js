const app = require('../../../../app');

const ExtendedSupertest = require('../../../extended-supertest');

const master = require('../../../data/users/master');
const master3 = require('../../../data/users/master-3');

const routeParams = require('./route-params/add-favorite');
const controller = require('./controllers/add-favorite/add-favorite');
const { before, after } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/profile/:profileId/favorite/:masterId';

const config = {
  template,
  routeParams: { profileId: master._id.toString(), masterId: master3._id.toString() },
  method: 'post',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before();

describe(`POST ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
