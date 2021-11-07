const app = require('../../../app');
const User = require('../../../models/user/user');
const Work = require('../../../models/work/work');

const ExtendedSupertest = require('../../extended-supertest');

const routeParams = require('./route-params/get-works');
const controller = require('./controllers/get-works');

const master = require('../../data/masters/master');
const works = require('../../data/works');
const { before, after } = require('../../utils/endpoint-test-preparation');

const template = `/api/v1/master/:masterId/work`;

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'get',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await Work.insertMany(works);
});

describe(`GET ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
