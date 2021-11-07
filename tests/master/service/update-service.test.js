const app = require('../../../app');
const User = require('../../../models/user/user');
const Service = require('../../../models/service/service');

const ExtendedSupertest = require('../../extended-supertest');

const routeParams = require('./route-params/update-service');
const bodyFields = require('./body-fields/update-service');
const controller = require('./controllers/update-service');

const master = require('../../data/masters/master');
const services = require('../../data/services/services');
const timetable = require('../../data/timetables/auto-timetable');

const Timetable = require('../../../models/timetable/timetable');
const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/service/:serviceId';

const config = {
  routeParams: { masterId: master._id.toString(), serviceId: services[0]._id.toString() },
  template,
  method: 'put',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await Service.insertMany(services);
  await Timetable.save(timetable);
});

describe(`PUT ${template}`, () => {
  request.testBodyFields(bodyFields).testRouteParams(routeParams).testController(controller);
});

after();
