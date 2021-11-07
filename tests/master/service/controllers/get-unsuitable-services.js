const { UNSUITABLE_SERVICES } = require('../../../../config/cache');
const { getCachedData } = require('../../../../utils/redis');
const master = require('../../../data/masters/master');

module.exports = function () {
  it('should successfully get unsuitable services', async () => {
    const response = await this.request();

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { unsuitableServices } = body;

    expect(unsuitableServices.length).toBe(2);

    const cachedData = await getCachedData(`id-${master._id.toString()}`, UNSUITABLE_SERVICES);

    expect(cachedData).not.toBeNull();
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
