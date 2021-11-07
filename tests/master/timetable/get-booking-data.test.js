const app = require('../../../app');
const User = require('../../../models/user/user');

const ExtendedSupertest = require('../../extended-supertest');

const routeParams = require('./route-params/get-booking-data');
const controller = require('./controllers/get-booking-data');

const master = require('../../data/masters/master');
const { before, after } = require('../../utils/endpoint-test-preparation');
const Appointment = require('../../../models/appointment/appointment');
const appointmentsForBooking = require('../../data/appointments/appointments-for-booking');

const template = '/api/v1/master/:masterId/timetable/booking';

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'get',
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await Appointment.insertMany(appointmentsForBooking);
});

describe(`POST ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after();
