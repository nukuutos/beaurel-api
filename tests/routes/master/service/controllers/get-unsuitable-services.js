const { UNSUITABLE_SERVICES } = require('../../../../../config/cache');
const Service = require('../../../../../models/service');
const User = require('../../../../../models/user');
const { getCachedData } = require('../../../../../utils/redis');
const master = require('../../../../data/users/master');
const unsuitableServices = require('../data/unsuitable-services');

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
    await Service.insertMany(unsuitableServices);
  });

  it('should successfully get unsuitable services', async () => {
    const response = await this.request();

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { unsuitableServices } = body;

    expect(unsuitableServices).toHaveLength(2);

    const cachedData = await getCachedData(`id-${master._id.toString()}`, UNSUITABLE_SERVICES);

    expect(cachedData).not.toBeNull();
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set(`${process.env.AUTH_HEADER}`, 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
