const dayjs = require('dayjs');
const { NO_TIMETABLE } = require('../../../../../config/errors/timetable');
const Appointment = require('../../../../../models/appointment');
const Timetable = require('../../../../../models/timetable');
const User = require('../../../../../models/user');
const appointments = require('../../../../data/appointments/booked-appointments');
const master = require('../../../../data/masters/master');
const autoTimetable = require('../../../../data/timetables/auto-timetable');

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
  });

  it('should successfully get booked appointments for 4 weeks from tomorrow', async () => {
    await User.save(master);
    await Timetable.save(autoTimetable);
    await Appointment.insertMany(appointments);

    const response = await this.request().query({
      date: dayjs().startOf('day').add(1, 'day').utc(true).format(),
    });

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    expect(Object.keys(body)).toHaveLength(4);
  });
};
