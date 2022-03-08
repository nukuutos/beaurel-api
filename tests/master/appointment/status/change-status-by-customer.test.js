const app = require('../../../../app');
const User = require('../../../../models/user');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/change-status-by-customer');
const bodyFields = require('./body-fields/change-status-by-customer');
const controller = require('./controllers/change-status-by-customer');

const master = require('../../../data/masters/master');
const master1 = require('../../../data/masters/master-1');
const appointments = require('../../../data/appointments/appointments');
const Appointment = require('../../../../models/appointment');
const { before, after } = require('../../../utils/endpoint-test-preparation');
const Timetable = require('../../../../models/timetable');
const autoTimetable = require('../../../data/timetables/auto-timetable');

const template = '/api/v1/master/:masterId/appointment/:appointmentId/status/customer';

const config = {
  template,
  routeParams: { masterId: master._id.toString(), appointmentId: appointments[0]._id },
  method: 'put',
  user: master1,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await Appointment.insertMany(appointments);
  await Timetable.save(autoTimetable);
});

describe(`PUT ${template}`, () => {
  request.testBodyFields(bodyFields).testRouteParams(routeParams).testController(controller);
});

after();
