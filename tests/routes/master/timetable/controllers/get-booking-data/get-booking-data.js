const cloneDeep = require('lodash.clonedeep');
const { NO_TIMETABLE } = require('../../../../../../config/errors/timetable');
const Appointment = require('../../../../../../models/appointment');

const Timetable = require('../../../../../../models/timetable');
const User = require('../../../../../../models/user');
const { dropRedis } = require('../../../../../../utils/redis');
const appointmentsForBooking = require('./appointments-for-booking');
const master = require('../../../../../data/users/master');
const autoTimetable = require('../../../data/auto-timetable');

module.exports = function () {
  beforeAll(async () => {
    await Appointment.insertMany(appointmentsForBooking);
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should fail, no timetable', async () => {
    await User.save(master);

    const response = await this.request();

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(NO_TIMETABLE);

    dropRedis();
  });

  it('should successfully get booking data', async () => {
    await Timetable.save(autoTimetable);

    const masterWithServicesTool = cloneDeep(master);
    masterWithServicesTool.tools.isServices = true;
    await User.save(masterWithServicesTool);

    const response = await this.request();

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { timetable, appointments, isServices } = body;

    expect(timetable).not.toBeNull();
    expect(Object.keys(appointments)).toHaveLength(2);
    expect(isServices).toBeTruthy();
  });
};
