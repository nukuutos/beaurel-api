const { SERVICES_AND_TIMETABLE } = require('../../../../../config/cache');
const Service = require('../../../../../models/service');
const Timetable = require('../../../../../models/timetable');
const User = require('../../../../../models/user');
const { getCachedData } = require('../../../../../utils/redis');
const master = require('../../../../data/users/master');
const services = require('../../data/services');
const autoTimetable = require('../../data/auto-timetable');

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
    await Service.insertMany(services);
    await Timetable.save(autoTimetable);
  });

  it('should successfully get services', async () => {
    const response = await this.request();

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { services, timetable } = body;

    expect(services).toHaveLength(2);

    expect(timetable).toHaveProperty('sessionTime');

    const cachedData = await getCachedData(`id-${master._id.toString()}`, SERVICES_AND_TIMETABLE);

    expect(cachedData).not.toBeNull();
  });
};
