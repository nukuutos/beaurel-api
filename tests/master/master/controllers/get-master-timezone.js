const { getCachedData } = require('../../../../utils/redis');
const master = require('../../../data/masters/master');

module.exports = function () {
  it('should successfully get master timezone', async () => {
    const response = await this.request();

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { timezone, city } = body;

    expect(timezone).toBe('Asia/Vladivostok');
    expect(city).toBe('Владивосток');

    const cachedData = await getCachedData(`id-${master._id.toString()}`, 'city');

    expect(cachedData).not.toBeNull();
  });
};
