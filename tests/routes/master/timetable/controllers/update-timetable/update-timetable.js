const cloneDeep = require('lodash.clonedeep');
const {
  NO_TIMETABLE,
  UPDATE_EXISTS,
  SAME_TIMETABLES,
  INCORRECT_EXCEPTIONS,
  INCORRECT_APPOINTMENTS,
} = require('../../../../../../config/errors/timetable');

const Appointment = require('../../../../../../models/appointment');

const appointmentsExceptions = require('./data/appointments-for-exceptions');
const appointmentsSessionTime = require('./data/appointments-for-session-time');
const appointmentsPossibleTimes = require('./data/appointments-for-possible-times');
const appointmentsWeekends = require('./data/appointments-for-weekends');
const appointmentsSwitchManually = require('./data/appointments-for-switch-type-to-manually');
const appointmentsManually = require('./data/appointments-for-manually');
const appointmentsSwitchAuto = require('./data/appointments-for-switch-type-to-auto');
const appointmentsSameDate = require('./data/appointments-same-date-with-update');

const Timetable = require('../../../../../../models/timetable');
const autoTimetable = require('../../../data/auto-timetable');
const autoTimetableWithUpdate = require('../../../data/auto-timetable-with-update');
const manuallyTimetable = require('../../../data/manually-timetable');
const services = require('../../../data/services');
const Service = require('../../../../../../models/service');

const {
  getServices,
  checkIsServiceCache,
  checkIsServiceCacheDeleted,
} = require('../utils/service-cache');

const {
  getUnsuitableServices,
  checkIsUnsuitableServiceCache,
  checkIsUnsuitableServiceCacheDeleted,
} = require('../utils/unsuitable-service-cache');
const {
  getBookingData,
  checkIsBookingDataCache,
  checkIsBookingDataCacheDeleted,
} = require('../utils/booking-data-cache');
const User = require('../../../../../../models/user');
const master = require('../../../../../data/users/master');
const moscowMaster = require('../../../data/moscow-master');
const moscowAutoTimetable = require('../../../data/moscow-auto-timetable');
const moscowAppointmentsSameDate = require('../../../data/moscow-appointments-same-date-with-update');
const moscowServices = require('../../../data/moscow-services');

const data = {
  sessionTime: 120,
  type: 'auto',
  auto: {
    workingDay: { startAt: 480, endAt: 1080 },
    weekends: [6],
    exceptions: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
  },
  manually: {
    appointments: {
      0: [],
      1: [600],
      2: [720],
      3: [],
      4: [720, 840],
      5: [600, 720, 960, 1080],
      6: [],
    },
  },
  date: new Date('2022-09-28T00:00:00.000Z'),
};

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
  });

  beforeEach(async () => {
    await Timetable.deleteMany({});
    await Appointment.deleteMany({});
  });

  it('should fail, no timetable', async () => {
    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(NO_TIMETABLE);
  });

  it('should fail, timetable update has already existed', async () => {
    await Timetable.save(autoTimetableWithUpdate);

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(UPDATE_EXISTS);
  });

  it('should fail, same timetables', async () => {
    await Timetable.save(autoTimetable);

    const update = cloneDeep(autoTimetable);
    delete update.auto.possibleAppointmentsTime;
    update.date = new Date('2023-09-28T00:00:00.000Z');

    const response = await this.request().send(update);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(SAME_TIMETABLES);
  });

  it('should fail, incorrect exceptions', async () => {
    await Timetable.save(autoTimetable);

    const dataWithInvalidUpdate = cloneDeep(data);

    dataWithInvalidUpdate.auto.exceptions = {
      0: [],
      1: [600, 720],
      2: [600, 700],
      3: [],
      4: [],
      5: [],
      6: [],
    };

    const response = await this.request().send(dataWithInvalidUpdate);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_EXCEPTIONS);
  });

  it('should fail, incorrect manually appointments', async () => {
    await Timetable.save(autoTimetable);

    const dataWithInvalidUpdate = cloneDeep(data);
    dataWithInvalidUpdate.type = 'manually';
    dataWithInvalidUpdate.manually.appointments = {
      0: [],
      1: [600, 720],
      2: [600, 700],
      3: [],
      4: [],
      5: [],
      6: [],
    };

    const response = await this.request().send(dataWithInvalidUpdate);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_APPOINTMENTS);
  });

  it('should successfully delete cache', async () => {
    await Timetable.save(autoTimetable);

    await getServices.request();
    await getUnsuitableServices.request();
    await getBookingData.request();

    await checkIsServiceCache();
    await checkIsUnsuitableServiceCache();
    await checkIsBookingDataCache();

    const response = await this.request().send(data);

    await checkIsServiceCacheDeleted();
    await checkIsUnsuitableServiceCacheDeleted();
    await checkIsBookingDataCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(200);
  });

  it('should successfully change appointment state to unsuitable(session time)', async () => {
    await Timetable.save(autoTimetable);
    await Appointment.insertMany(appointmentsSessionTime);

    const update = cloneDeep(data);
    update.sessionTime = 90;

    const response = await this.request().send(update);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const unsuitableAppointments = await Appointment.find({ status: 'unsuitable' });

    expect(unsuitableAppointments).toHaveLength(2);
    const { user, status: recordStatus } = unsuitableAppointments[1].history[1];

    expect(user).toBe('server');
    expect(recordStatus).toBe('unsuitable');
  });

  it('should successfully change appointment state to unsuitable(possible times)', async () => {
    await Timetable.save(autoTimetable);
    await Appointment.insertMany(appointmentsPossibleTimes);

    const update = cloneDeep(data);
    update.sessionTime = 90;

    const response = await this.request().send(update);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const unsuitableAppointments = await Appointment.find({ status: 'unsuitable' });

    expect(unsuitableAppointments).toHaveLength(2);

    const { user, status: recordStatus } = unsuitableAppointments[1].history[1];

    expect(user).toBe('server');
    expect(recordStatus).toBe('unsuitable');
  });

  it('should successfully change appointment state to unsuitable(weekends)', async () => {
    await Timetable.save(autoTimetable);
    await Appointment.insertMany(appointmentsWeekends);

    const update = cloneDeep(data);
    update.auto.weekends = [5, 6];

    const response = await this.request().send(update);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const unsuitableAppointments = await Appointment.find({ status: 'unsuitable' });

    expect(unsuitableAppointments).toHaveLength(3);

    const { user, status: recordStatus } = unsuitableAppointments[1].history[1];

    expect(user).toBe('server');
    expect(recordStatus).toBe('unsuitable');
  });

  it('should successfully change appointment state to unsuitable(exceptions)', async () => {
    await Timetable.save(autoTimetable);
    await Appointment.insertMany(appointmentsExceptions);

    const update = cloneDeep(data);
    update.auto.exceptions = { 0: [600], 1: [600, 720], 2: [], 3: [], 4: [], 5: [], 6: [] };

    const response = await this.request().send(update);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const unsuitableAppointments = await Appointment.find({ status: 'unsuitable' });

    expect(unsuitableAppointments).toHaveLength(2);

    const { user, status: recordStatus } = unsuitableAppointments[1].history[1];

    expect(user).toBe('server');
    expect(recordStatus).toBe('unsuitable');
  });

  it('should successfully change appointment state to unsuitable(switch type to manually)', async () => {
    await Timetable.save(autoTimetable);
    await Appointment.insertMany(appointmentsSwitchManually);

    const update = cloneDeep(data);
    update.type = 'manually';

    const response = await this.request().send(update);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const unsuitableAppointments = await Appointment.find({ status: 'unsuitable' });

    expect(unsuitableAppointments).toHaveLength(3);

    const { user, status: recordStatus } = unsuitableAppointments[1].history[1];

    expect(user).toBe('server');
    expect(recordStatus).toBe('unsuitable');
  });

  it('should successfully change appointment state to unsuitable(manually appointments update)', async () => {
    await Timetable.save(manuallyTimetable);
    await Appointment.insertMany(appointmentsManually);

    const update = cloneDeep(data);
    update.type = 'manually';
    update.manually.appointments = {
      0: [600],
      1: [600, 720],
      2: [720],
      3: [],
      4: [720, 840],
      5: [600, 720, 960, 1080],
      6: [],
    };

    const response = await this.request().send(update);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const unsuitableAppointments = await Appointment.find({ status: 'unsuitable' });

    expect(unsuitableAppointments).toHaveLength(2);

    const { user, status: recordStatus } = unsuitableAppointments[1].history[1];

    expect(user).toBe('server');
    expect(recordStatus).toBe('unsuitable');
  });

  it('should successfully change appointment state to unsuitable(switch type to auto)', async () => {
    await Timetable.save(manuallyTimetable);
    await Appointment.insertMany(appointmentsSwitchAuto);

    const update = cloneDeep(data);
    update.auto.exceptions = { 0: [], 1: [], 2: [], 3: [], 4: [720], 5: [], 6: [] };

    const response = await this.request().send(update);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const unsuitableAppointments = await Appointment.find({ status: 'unsuitable' });

    expect(unsuitableAppointments).toHaveLength(3);

    const { user, status: recordStatus } = unsuitableAppointments[1].history[1];

    expect(user).toBe('server');
    expect(recordStatus).toBe('unsuitable');
  });

  it('should successfully change appointment state to unsuitable(same date of appointment and timetable update)', async () => {
    await Timetable.save(autoTimetable);
    await Appointment.insertMany(appointmentsSameDate);

    const update = cloneDeep(data);
    update.auto.workingDay.endAt = 1100;
    update.date = new Date('2023-11-17T00:00:00Z');

    const response = await this.request().send(update);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const unsuitableAppointments = await Appointment.find({ status: 'unsuitable' });

    expect(unsuitableAppointments).toHaveLength(1);

    const { user, status: recordStatus } = unsuitableAppointments[0].history[1];

    expect(user).toBe('server');
    expect(recordStatus).toBe('unsuitable');
  });

  it('should successfully change appointment state to unsuitable(Moscow timezone)', async () => {
    await User.save(moscowMaster);
    await Timetable.save(moscowAutoTimetable);
    await Appointment.insertMany(moscowAppointmentsSameDate);

    const update = cloneDeep(data);
    update.auto.workingDay.endAt = 1100;
    update.date = new Date('2023-11-17T00:00:00Z');

    const moscowRequest = cloneDeep(this);
    moscowRequest.routeParams = {
      masterId: moscowMaster._id.toString(),
      timetableId: moscowAutoTimetable._id.toString(),
    };
    moscowRequest.user = moscowMaster;

    const response = await moscowRequest.request().send(update);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const unsuitableAppointments = await Appointment.find({ status: 'unsuitable' });

    expect(unsuitableAppointments).toHaveLength(1);
  });

  it('should successfully change services to unsuitable', async () => {
    await Timetable.save(autoTimetable);
    await Service.insertMany(services);

    const update = cloneDeep(data);
    update.sessionTime = 90;

    const response = await this.request().send(update);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const unsuitableServices = await Service.find({ 'update.status': 'unsuitable' });

    expect(unsuitableServices).toHaveLength(5);

    const service = unsuitableServices[0];

    expect(service.update).toHaveProperty('status');
    expect(service.update).toHaveProperty('date');
    expect(service.update.date.getTime()).toBe(new Date('2022-09-27T14:00:00.000Z').getTime());

    const timetable = await Timetable.findOne({});

    expect(timetable.update.date.getTime()).toBe(new Date('2022-09-27T14:00:00.000Z').getTime());

    await Service.deleteMany({});
  });

  it('should successfully change services to unsuitable(Moscow timezone)', async () => {
    await Timetable.save(moscowAutoTimetable);
    await Service.insertMany(moscowServices);

    const update = cloneDeep(data);
    update.sessionTime = 90;

    const moscowRequest = cloneDeep(this);
    moscowRequest.routeParams = {
      masterId: moscowMaster._id.toString(),
      timetableId: moscowAutoTimetable._id.toString(),
    };
    moscowRequest.user = moscowMaster;

    const response = await moscowRequest.request().send(update);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const unsuitableServices = await Service.find({ 'update.status': 'unsuitable' });
    const timetableDb = await Timetable.findOne({}, { 'update.date': 1 });
    expect(timetableDb.update.date).toStrictEqual(new Date('2022-09-27T21:00:00.000Z'));

    expect(unsuitableServices).toHaveLength(5);

    const service = unsuitableServices[0];

    expect(service.update.date).toStrictEqual(new Date('2022-09-27T21:00:00.000Z'));
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set(`${process.env.AUTH_HEADER}`, 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
