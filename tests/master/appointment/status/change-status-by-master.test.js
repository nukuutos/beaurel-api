const app = require('../../../../app');
const User = require('../../../../models/user/user');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/change-status-by-master');
const bodyFields = require('./body-fields/change-status-by-master');
const controller = require('./controllers/change-status-by-master');

const master = require('../../../data/masters/master');
const appointments = require('../../../data/appointments/appointments');
const Appointment = require('../../../../models/appointment/appointment');
const { before, after } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/master/:masterId/appointment/:appointmentId/status/master';

const config = {
  template,
  routeParams: { masterId: master._id.toString(), appointmentId: appointments[0]._id },
  method: 'put',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await Appointment.insertMany(appointments);
});

describe(`PUT ${template}`, () => {
  request.testBodyFields(bodyFields).testRouteParams(routeParams).testController(controller);
});

after();