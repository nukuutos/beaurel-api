const cloneDeep = require('lodash.clonedeep');
const { ObjectId } = require('mongodb');
const {
  INCORRECT_DURATION,
  WEEKEND,
  EXCEPTION,
  UNAVAILABLE_TIME,
  MORE_THAN_MAX,
  INCORRECT_TIME,
  INVALID_APPOINTMENT,
  INCORRECT_STATUS,
} = require('../../../../../../config/errors/appointment');
const Appointment = require('../../../../../../models/appointment');

const Timetable = require('../../../../../../models/timetable');
const autoTimetable = require('../../../data/auto-timetable');
const manuallyTimetable = require('../../../data/manually-timetable');
const autoTimetableWithUpdate = require('../../../data/auto-timetable-with-update');
const { getBookingData, checkIsCache, checkIsCacheDeleted } = require('./utils');
const unsuitableAppointment = require('../data/unsuitable-appointment');
const User = require('../../../../../../models/user');
const master = require('../../../../../data/users/master');

const data = {
  duration: 120,
  time: {
    startAt: 720,
    endAt: 840,
  },
  date: new Date('2023-12-22T00:00:00.000Z'),
};

module.exports = function () {
  afterEach(async () => {
    await Timetable.deleteMany({});
    await Appointment.deleteMany({});
    await User.deleteMany({});

    await User.save(master);
  });

  it('should fail, no appointment', async () => {
    const response = await this.request().send(data);

    const { statusCode, body } = response;
    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(INVALID_APPOINTMENT);
  });

  it('should fail, with incorrect startAt and endAt', async () => {
    await Timetable.save(autoTimetable);
    await Appointment.save(unsuitableAppointment);

    const response = await this.request().send({ ...data, time: { ...data.time, endAt: 830 } });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_DURATION);
  });

  it('should fail, with incorrect duration and timetable session time', async () => {
    const timetable = cloneDeep(autoTimetable);
    timetable.sessionTime = 90;

    await Appointment.save(unsuitableAppointment);
    await Timetable.save(timetable);

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_DURATION);
  });

  it('should fail, with incorrect appointment status', async () => {
    const appointmentWithIncorrectStatus = { ...unsuitableAppointment, status: 'onConfirmation' };

    await Timetable.save(autoTimetable);
    await Appointment.save(appointmentWithIncorrectStatus);

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_STATUS);
  });

  it('should fail, weekend', async () => {
    await Timetable.save(autoTimetable);
    await Appointment.save(unsuitableAppointment);

    const response = await this.request().send({ ...data, date: '2022-11-20T00:00:00.000Z' });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(WEEKEND);
  });

  it('should fail, exception', async () => {
    await Timetable.save(autoTimetable);
    await Appointment.save(unsuitableAppointment);

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
    await Appointment.save(unsuitableAppointment);

    const response = await this.request().send({ ...data, time: { startAt: 1080, endAt: 1200 } });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(MORE_THAN_MAX);
  });

  it('should fail, time is reserved', async () => {
    const reservedAppointment = cloneDeep(unsuitableAppointment);
    reservedAppointment._id = new ObjectId('61acd03c847544f1f4ed73a2');
    reservedAppointment.time = { ...data.time };
    reservedAppointment.date = data.date;
    reservedAppointment.status = 'onConfirmation';

    await Timetable.save(autoTimetable);
    await Appointment.insertMany([unsuitableAppointment, reservedAppointment]);

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(UNAVAILABLE_TIME);
  });

  it('should fail, time is not corresponding to free appointments', async () => {
    await Timetable.save(autoTimetable);
    await Appointment.save(unsuitableAppointment);

    const response = await this.request().send({ ...data, time: { startAt: 950, endAt: 1070 } });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(UNAVAILABLE_TIME);
  });

  it('should fail, manually timetable - time is not existing', async () => {
    await Timetable.save(manuallyTimetable);
    await Appointment.save(unsuitableAppointment);

    const response = await this.request().send({ ...data, time: { startAt: 480, endAt: 600 } });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_TIME);
  });

  it('should fail, manually timetable - time is reserved', async () => {
    const reservedAppointment = cloneDeep(unsuitableAppointment);
    reservedAppointment._id = new ObjectId('61acd03c847544f1f4ed73a2');
    reservedAppointment.time = { ...data.time };
    reservedAppointment.date = data.date;
    reservedAppointment.status = 'onConfirmation';

    await Timetable.save(autoTimetable);
    await Appointment.insertMany([unsuitableAppointment, reservedAppointment]);

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(UNAVAILABLE_TIME);

    await Appointment.deleteMany({});
  });

  it('should successfully update appointment', async () => {
    await Timetable.save(manuallyTimetable);
    await Appointment.save(unsuitableAppointment);

    await getBookingData.request();
    await checkIsCache();

    const response = await this.request().send(data);

    await checkIsCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const appointmentDB = await Appointment.findOne({});

    expect(appointmentDB.time).toMatchObject(data.time);
    expect(appointmentDB.service.duration).toBe(data.duration);
    expect(appointmentDB.status).toBe('confirmed');
    expect(appointmentDB.date).toMatchObject(new Date('2023-12-21T14:00:00.000Z'));
    expect(appointmentDB.history[2].status).toBe('confirmed');
    expect(appointmentDB.history[2].user).toBe('master');
  });

  it('should success, with timetable update and service update', async () => {
    await Timetable.save(autoTimetableWithUpdate);
    await Appointment.save(unsuitableAppointment);

    const response = await this.request().send({
      ...data,
      time: { startAt: 480, endAt: 570 },
      duration: 90,
    });

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const appointmentDB = await Appointment.findOne({});

    expect(appointmentDB.service.duration).toBe(90);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set(`${process.env.AUTH_HEADER}`, 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
