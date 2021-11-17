const app = require('../../../app');
const User = require('../../../models/user');

const ExtendedSupertest = require('../../extended-supertest');

const routeParams = require('./route-params/delete-sub-service');
const controller = require('./controllers/delete-sub-service');

const master = require('../../data/masters/master');
const serviceParameter = require('../../data/services/service-parameter');
const timetable = require('../../data/timetables/auto-timetable');

const Timetable = require('../../../models/timetable');
const ServiceParameter = require('../../../models/service-parameter');
const { before, after } = require('../../utils/endpoint-test-preparation');

const subService = serviceParameter[0];
const { title, _id } = subService;

const template = '/api/v1/master/:masterId/service-parameter/:titleId/sub-service/:subServiceId';

const config = {
  template,
  routeParams: { masterId: master._id.toString(), titleId: title, subServiceId: _id.toString() },
  method: 'delete',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await ServiceParameter.insertMany(serviceParameter);
  await Timetable.save(timetable);
});

describe(`DELETE ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
