const User = require('../../../../../models/user');
const { getCachedData } = require('../../../../../utils/redis');
const master = require('../../../../data/users/master');

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
  });

  it('should successfully get user city and timezone', async () => {
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
