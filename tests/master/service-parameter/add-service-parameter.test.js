const app = require('../../../app');
const User = require('../../../models/user');
const Service = require('../../../models/service');

const ExtendedSupertest = require('../../extended-supertest');

const routeParams = require('./route-params/add-service-parameter');
const bodyFields = require('./body-fields/add-service-parameter');
const controller = require('./controllers/add-service-parameter');

const master = require('../../data/masters/master');
const services = require('../../data/services/services');
const timetable = require('../../data/timetables/auto-timetable');

const Timetable = require('../../../models/timetable');
const { after, before } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/service-parameter';

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'post',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await Service.insertMany(services);
  await Timetable.save(timetable);
});

describe(`POST ${template}`, () => {
  request.testBodyFields(bodyFields).testRouteParams(routeParams).testController(controller);
});

after();
