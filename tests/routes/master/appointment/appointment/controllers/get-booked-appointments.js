const dayjs = require('dayjs');
const cloneDeep = require('lodash.clonedeep');
const { NO_TIMETABLE } = require('../../../../../../config/errors/timetable');
const Appointment = require('../../../../../../models/appointment');
const Timetable = require('../../../../../../models/timetable');
const User = require('../../../../../../models/user');
const appointments = require('../data/booked-appointments');
const master = require('../../../../../data/users/master');
const autoTimetable = require('../../../data/auto-timetable');
const { getBookedAppointmentsCacheName } = require('../../../../../../config/cache');
const { getCachedData } = require('../../../../../../utils/redis');
const moscowMaster = require('../../../data/moscow-master');
const moscowAutoTimetable = require('../../../data/moscow-auto-timetable');
const moscowBookedAppointments = require('../../../data/moscow-booked-appointments');

const queryData = { date: dayjs().startOf('day').utc(true).format() };

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
    await Appointment.deleteMany({});
    await Timetable.deleteMany({});
  });

  it('should fail, no timetable', async () => {
    await User.save(master);
    await Appointment.insertMany(appointments);

    const response = await this.request().query(queryData);

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(NO_TIMETABLE);
  });

  it('should successfully get booked appointments for 4 weeks from today', async () => {
    await User.save(master);
    await Timetable.save(autoTimetable);
    await Appointment.insertMany(appointments);

    const response = await this.request().query(queryData);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    expect(Object.keys(body)).toHaveLength(3);

    const firstCacheKey = getBookedAppointmentsCacheName(master._id);
    const secondCacheKey = queryData.date;

    const cachedData = await getCachedData(firstCacheKey, secondCacheKey);

    const parsedData = JSON.parse(cachedData);

    expect(parsedData).toHaveLength(3);
  });

  it('should successfully get booked appointments for 4 weeks from tomorrow', async () => {
    await User.save(master);
    await Timetable.save(autoTimetable);
    await Appointment.insertMany(appointments);

    const date = dayjs().startOf('day').add(1, 'day').utc(true).format();

    const response = await this.request().query({
      date,
    });

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    expect(Object.keys(body)).toHaveLength(4);

    const firstCacheKey = getBookedAppointmentsCacheName(master._id);
    const secondCacheKey = date;

    const cachedData = await getCachedData(firstCacheKey, secondCacheKey);

    const parsedData = JSON.parse(cachedData);

    expect(parsedData).toHaveLength(4);
  });

  it('should successfully get booked appointments in moscowTz', async () => {
    await User.save(moscowMaster);
    await Timetable.save(moscowAutoTimetable);
    await Appointment.insertMany(moscowBookedAppointments);

    const requestToMoscowMaster = cloneDeep(this);
    requestToMoscowMaster.routeParams = { masterId: moscowMaster._id.toString() };

    const response = await requestToMoscowMaster.request().query(queryData);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    expect(Object.keys(body)).toHaveLength(2);
  });
};
