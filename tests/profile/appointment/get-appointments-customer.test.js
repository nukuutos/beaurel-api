const app = require('../../../app');
const User = require('../../../models/user');

const ExtendedSupertest = require('../../extended-supertest');

const master1 = require('../../data/masters/master-1');
const appointments = require('../../data/appointments/appointments');

const queryParams = require('./query-params/get-appointments-master');
const routeParams = require('./route-params/get-appointments-master');
const controller = require('./controllers/get-appointments-master');

const Appointment = require('../../../models/appointment');
const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/profile/:profileId/appointment/customer';

const config = {
  template,
  routeParams: { profileId: master1._id.toString() },
  method: 'get',
  user: master1,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master1);
  await Appointment.insertMany(appointments);
});

describe(`GET ${template}`, () => {
  request.testRouteParams(routeParams).testQueryParams(queryParams).testController(controller);
});

after();
