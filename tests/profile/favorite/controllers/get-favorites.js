const { getFavoritesCacheName } = require('../../../../config/cache');
const { getCachedData } = require('../../../../utils/redis');
const master = require('../../../data/masters/master');

module.exports = function () {
  it('should successfully get favorites', async () => {
    const response = await this.request().query({ page: 0 });

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    expect(body).toHaveLength(2);
    const cacheKeys = [getFavoritesCacheName(master._id.toString()), 0];
    const cacheData = await getCachedData(...cacheKeys);
    const parsedCacheData = JSON.parse(cacheData);

    expect(parsedCacheData).toHaveLength(2);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
