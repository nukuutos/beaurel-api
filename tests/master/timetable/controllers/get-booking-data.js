const { NO_TIMETABLE } = require('../../../../config/errors/timetable');

const Timetable = require('../../../../models/timetable');
const { dropRedis } = require('../../../../utils/redis');
const autoTimetable = require('../../../data/timetables/auto-timetable');

module.exports = function () {
  it('should fail, no timetable', async () => {
    const response = await this.request();

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(NO_TIMETABLE);

    dropRedis();
  });

  it('should successfully get booking data', async () => {
    await Timetable.save(autoTimetable);

    const response = await this.request();

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { timetable, appointments } = body;

    expect(timetable).not.toBeNull();
    expect(Object.keys(appointments).length).toBe(2);
  });
};
