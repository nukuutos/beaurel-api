const app = require('../../../../app');
const User = require('../../../../models/user');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/add-review');
const bodyFields = require('./body-fields/add-review');
const controller = require('./controllers/add-review');

const master = require('../../../data/masters/master');
const appointments = require('../../../data/appointments/appointments');
const Appointment = require('../../../../models/appointment');
const master1 = require('../../../data/masters/master-1');
const { before, after } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/appointment/:appointmentId/review';

const config = {
  routeParams: { masterId: master._id.toString(), appointmentId: appointments[0]._id.toString() },
  template,
  method: 'post',
  user: master1,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.insertMany([master, master1]);
  await Appointment.insertMany(appointments);
});

describe(`PUT ${template}`, () => {
  request.testBodyFields(bodyFields).testRouteParams(routeParams).testController(controller);
});

after();
