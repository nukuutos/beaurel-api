const app = require('../../../app');
const User = require('../../../models/user');
const Service = require('../../../models/service');

const ExtendedSupertest = require('../../extended-supertest');

const routeParams = require('./route-params/get-services');
const controller = require('./controllers/get-services');

const master = require('../../data/masters/master');
const services = require('../../data/services/services');
const timetable = require('../../data/timetables/auto-timetable');

const Timetable = require('../../../models/timetable');
const { after, before } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/service';

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'get',
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await Service.insertMany(services);
  await Timetable.save(timetable);
});

describe(`GET ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
