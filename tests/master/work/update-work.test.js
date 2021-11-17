const app = require('../../../app');
const User = require('../../../models/user');
const Work = require('../../../models/work');

const ExtendedSupertest = require('../../extended-supertest');

const bodyFields = require('./body-fields/update-work');
const routeParams = require('./route-params/update-work');
const controller = require('./controllers/update-work');

const master = require('../../data/masters/master');
const works = require('../../data/works');
const { before, after } = require('../../utils/endpoint-test-preparation');

const template = `/api/v1/master/:masterId/work/:workId`;

const config = {
  template,
  routeParams: { masterId: master._id.toString(), workId: works[0]._id.toString() },
  method: 'put',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await Work.insertMany(works);
});

describe(`PUT ${template}`, () => {
  request.testRouteParams(routeParams).testBodyFields(bodyFields).testController(controller);
});

after();
