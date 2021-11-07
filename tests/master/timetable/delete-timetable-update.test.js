const app = require('../../../app');
const User = require('../../../models/user/user');

const ExtendedSupertest = require('../../extended-supertest');

const routeParams = require('./route-params/delete-timetable-update');
const controller = require('./controllers/delete-timetable-update');

const master = require('../../data/masters/master');
const Timetable = require('../../../models/timetable/timetable');
const autoTimetable = require('../../data/timetables/auto-timetable');
const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/timetable/:timetableId/update';

const config = {
  template,
  routeParams: { masterId: master._id.toString(), timetableId: autoTimetable._id.toString() },
  method: 'delete',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await Timetable.save(autoTimetable);
});

describe(`DELETE ${template}`, () => {
  request.testController(controller).testRouteParams(routeParams);
});

after();
