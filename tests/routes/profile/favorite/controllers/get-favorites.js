const { getFavoritesCacheName } = require('../../../../../config/cache');
const User = require('../../../../../models/user');
const { getCachedData } = require('../../../../../utils/redis');
const master = require('../../../../data/users/master');
const master1 = require('../../../../data/users/master-1');
const master2 = require('../../../../data/users/master-2');

module.exports = function () {
  beforeAll(async () => {
    await User.insertMany([master, master1, master2]);
  });

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
    const response = await this.request().set(`${process.env.AUTH_HEADER}`, 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
