const { getCachedData } = require('../../../../utils/redis');
const master = require('../../../data/masters/master');

module.exports = function () {
  it('should successfully get favorites', async () => {
    const response = await this.request();

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { data } = body;

    expect(data).toHaveProperty('masters');
    expect(data).toHaveProperty('ids');

    expect(data.masters.length).toBe(2);
    expect(data.ids.length).toBe(2);

    const cacheData = await getCachedData(`id-${master._id.toString()}`, 'favorites');
    const parsedCacheData = JSON.parse(cacheData);

    expect(parsedCacheData.masters.length).toBe(2);
    expect(parsedCacheData.ids.length).toBe(2);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
