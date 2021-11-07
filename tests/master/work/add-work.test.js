const app = require('../../../app');
const User = require('../../../models/user/user');
const Work = require('../../../models/work/work');

const ExtendedSupertest = require('../../extended-supertest');

const bodyFields = require('./body-fields/add-work');
const routeParams = require('./route-params/add-work');
const controller = require('./controllers/add-work');

const master = require('../../data/masters/master');
const works = require('../../data/works');
const { before, after } = require('../../utils/endpoint-test-preparation');

const template = `/api/v1/master/:masterId/work`;

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'post',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await Work.insertMany(works);
});

describe(`POST ${template}`, () => {
  request.testRouteParams(routeParams).testBodyFields(bodyFields).testController(controller);
});

after();
