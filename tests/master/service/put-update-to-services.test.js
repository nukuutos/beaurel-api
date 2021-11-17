const app = require('../../../app');
const User = require('../../../models/user');
const Service = require('../../../models/service');

const ExtendedSupertest = require('../../extended-supertest');

const routeParams = require('./route-params/put-update-to-services');
const bodyFields = require('./body-fields/put-update-to-services');
const controller = require('./controllers/put-update-to-services');

const master = require('../../data/masters/master');
const unsuitableServices = require('../../data/services/unsuitable-services');
const timetableWithUpdate = require('../../data/timetables/auto-timetable-with-update');

const Timetable = require('../../../models/timetable');
const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/service/update';

const config = {
  routeParams: { masterId: master._id.toString() },
  template,
  method: 'put',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await Service.insertMany(unsuitableServices);
  await Timetable.save(timetableWithUpdate);
});

describe(`PUT ${template}`, () => {
  request.testBodyFields(bodyFields).testRouteParams(routeParams).testController(controller);
});

after();
