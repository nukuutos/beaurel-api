const cloneDeep = require('lodash.clonedeep');
const {
  INCORRECT_SERVICE,
  INCORRECT_TIMETABLE,
  INCORRECT_DURATION,
  UNSUITABLE_SERVICE,
  WEEKEND,
  EXCEPTION,
  UNAVAILABLE_TIME,
  MORE_THAN_MAX,
  INCORRECT_TIME,
} = require('../../../../../../config/errors/appointment');
const Appointment = require('../../../../../../models/appointment');
const Service = require('../../../../../../models/service');

const Timetable = require('../../../../../../models/timetable');
const services = require('../../../data/services');
const autoTimetable = require('../../../data/auto-timetable');
const manuallyTimetable = require('../../../data/manually-timetable');
const timetableWithUpdate = require('../../../data/auto-timetable-with-update');
const autoTimetableWithUpdate = require('../../../data/auto-timetable-with-update');
const servicesWithUpdate = require('../data/services-with-update');
const { getBookingData, checkIsCache, checkIsCacheDeleted } = require('./utils');
const User = require('../../../../../../models/user');
const master = require('../../../../../data/users/master');
const master1 = require('../../../../../data/users/master-1');
const moscowMaster = require('../../../data/moscow-master');
const moscowAutoTimetable = require('../../../data/moscow-auto-timetable');
const moscowServices = require('../../../data/moscow-services');

const data = {
  serviceId: services[0]._id.toString(),
  time: {
    startAt: 720,
    endAt: 840,
  },
  date: '2023-12-22T00:00:00.000Z',
};

module.exports = function () {
  beforeEach(async () => {
    await Timetable.deleteMany({});
    await Service.deleteMany({});
    await Appointment.deleteMany({});
    await User.deleteMany({});

    await User.insertMany([master, master1]);
  });

  it('should fail, no timetable', async () => {
    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(INCORRECT_TIMETABLE);
  });

  it('should fail, no service', async () => {
    await Timetable.save(autoTimetable);

    const response = await this.request().send({ ...data, serviceId: '6212fc858fce2120cc841b68' });

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(INCORRECT_SERVICE);
  });

  it('should fail, with incorrect startAt and endAt', async () => {
    await Timetable.save(autoTimetable);
    await Service.insertMany(services);

    const response = await this.request().send({ ...data, time: { ...data.time, endAt: 830 } });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_DURATION);
  });

  it('should fail, with incorrect service duration and timetable session time', async () => {
    const timetable = cloneDeep(autoTimetable);
    timetable.sessionTime = 90;

    await Service.insertMany(services);
    await Timetable.save(timetable);

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_DURATION);
  });

  it('should fail, with timetable update and unsuitable service', async () => {
    const servicesForTest = cloneDeep(services);
    servicesForTest[0].update = { status: 'unsuitable', date: timetableWithUpdate.update.date };

    await Timetable.save(timetableWithUpdate);
    await Service.insertMany(servicesForTest);

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(UNSUITABLE_SERVICE);
  });

  it('should fail, weekend', async () => {
    await Timetable.save(autoTimetable);
    await Service.insertMany(services);

    const response = await this.request().send({ ...data, date: '2022-11-20T00:00:00.000Z' });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(WEEKEND);
  });

  it('should fail, exception', async () => {
    await Timetable.save(autoTimetable);
    await Service.insertMany(services);

    const response = await this.request().send({
      ...data,
      time: { startAt: 600, endAt: 720 },
      date: '2022-11-17T00:00:00.000Z',
    });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(EXCEPTION);
  });

  it('should fail, more than working day', async () => {
    await Timetable.save(autoTimetable);
    await Service.insertMany(services);

    const response = await this.request().send({ ...data, time: { startAt: 1080, endAt: 1200 } });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(MORE_THAN_MAX);
  });

  it('should fail, time is reserved', async () => {
    await Timetable.save(autoTimetable);
    await Service.insertMany(services);

    await this.request().send(data);
    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(UNAVAILABLE_TIME);
  });

  it('should fail, time is not corresponding to free appointments', async () => {
    await Timetable.save(autoTimetable);
    await Service.insertMany(services);

    const response = await this.request().send({ ...data, time: { startAt: 950, endAt: 1070 } });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(UNAVAILABLE_TIME);
  });

  it('should fail, manually timetable - time is not existing', async () => {
    await Timetable.save(manuallyTimetable);
    await Service.insertMany(services);

    const response = await this.request().send({ ...data, time: { startAt: 480, endAt: 600 } });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_TIME);
  });

  it('should fail, manually timetable - time is reserved', async () => {
    await Timetable.save(manuallyTimetable);
    await Service.insertMany(services);

    await this.request().send(data);
    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(UNAVAILABLE_TIME);
  });

  it('should successfully book appointment(manually)', async () => {
    await Timetable.save(manuallyTimetable);
    await Service.insertMany(services);

    await getBookingData.request();
    await checkIsCache();

    const response = await this.request().send(data);

    await checkIsCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(201);

    const appointmentDB = await Appointment.findOne({});

    expect(appointmentDB).toHaveProperty('_id');
    expect(appointmentDB).toHaveProperty('customerId');
    expect(appointmentDB).toHaveProperty('masterId');
    expect(appointmentDB).toHaveProperty('time');
    expect(appointmentDB).toHaveProperty('service');
    expect(appointmentDB).toHaveProperty('history');
    expect(appointmentDB).toHaveProperty('status');
    expect(appointmentDB).toHaveProperty('createdAt');
    expect(appointmentDB.isViewed.master).toBe(false);
    expect(appointmentDB.isViewed.customer).toBe(true);
  });

  it('should successfully book appointment(manually) with existing appointments on this day', async () => {
    await Timetable.save(manuallyTimetable);
    await Service.insertMany(services);

    await getBookingData.request();
    await checkIsCache();

    await this.request().send({ ...data, time: { startAt: 840, endAt: 960 } });
    await this.request().send({ ...data, time: { startAt: 600, endAt: 720 } });

    const response = await this.request().send(data);

    await checkIsCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(201);

    const appointmentsDB = await Appointment.find();
    expect(appointmentsDB).toHaveLength(3);
  });

  it('should successfully book appointment for moscow timezone', async () => {
    await User.save(moscowMaster);
    await Timetable.save(moscowAutoTimetable);
    await Service.insertMany(moscowServices);

    const moscowRequest = cloneDeep(this);

    moscowRequest.routeParams = { masterId: moscowMaster._id.toString() };

    const response = await moscowRequest.request().send(data);

    const { statusCode } = response;

    expect(statusCode).toBe(201);

    const appointmentDB = await Appointment.findOne({});

    expect(appointmentDB.date).toStrictEqual(new Date('2023-12-21T21:00:00Z'));
  });

  it('should success, with timetable update and service update', async () => {
    await Timetable.save(autoTimetableWithUpdate);
    await Service.insertMany(servicesWithUpdate);

    const response = await this.request().send({ ...data, time: { startAt: 480, endAt: 570 } });

    const { statusCode } = response;

    expect(statusCode).toBe(201);

    const appointmentDB = await Appointment.findOne({});

    expect(appointmentDB.service.duration).toBe(90);
  });

  it('should success, with timetable update and service', async () => {
    const servicesForTest = cloneDeep(services);
    servicesForTest[0].duration = 90;

    await Timetable.save(autoTimetableWithUpdate);
    await Service.insertMany(servicesForTest);

    const response = await this.request().send({ ...data, time: { startAt: 480, endAt: 570 } });

    const { statusCode } = response;

    expect(statusCode).toBe(201);

    const appointmentDB = await Appointment.findOne({});

    expect(appointmentDB.service.duration).toBe(90);
  });

  it('should successfully book your own appointment', async () => {
    await Timetable.save(manuallyTimetable);
    await Service.insertMany(services);

    const bookingRequestByMaster = cloneDeep(this);
    bookingRequestByMaster.user = master;

    const response = await bookingRequestByMaster.request().send(data);

    const { statusCode } = response;

    expect(statusCode).toBe(201);

    const appointmentDB = await Appointment.findOne({});

    expect(appointmentDB.isViewed.master).toBe(true);
    expect(appointmentDB.isViewed.customer).toBe(true);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
