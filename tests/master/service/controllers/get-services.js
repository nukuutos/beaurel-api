const { SERVICES_AND_TIMETABLE } = require('../../../../config/cache');
const { getCachedData } = require('../../../../utils/redis');
const master = require('../../../data/masters/master');

module.exports = function () {
  it('should successfully get services', async () => {
    const response = await this.request();

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { services, timetable } = body;

    expect(services.length).toBe(2);

    expect(timetable).toHaveProperty('sessionTime');

    const cachedData = await getCachedData(`id-${master._id.toString()}`, SERVICES_AND_TIMETABLE);

    expect(cachedData).not.toBeNull();
  });
};
