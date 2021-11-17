const app = require('../../../app');
const User = require('../../../models/user');

const ExtendedSupertest = require('../../extended-supertest');

const bodyFields = require('./body-fields/update-timetable');
const routeParams = require('./route-params/update-timetable');
const controller = require('./controllers/update-timetable');

const master = require('../../data/masters/master');
const autoTimetable = require('../../data/timetables/auto-timetable');
const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/timetable/:timetableId/update';

const config = {
  template,
  routeParams: { masterId: master._id.toString(), timetableId: autoTimetable._id.toString() },
  method: 'post',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
});

describe(`POST ${template}`, () => {
  request.testBodyFields(bodyFields).testRouteParams(routeParams).testController(controller);
});

after();
