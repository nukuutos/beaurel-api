const { WORKS } = require('../../../../config/cache');
const { getCachedData } = require('../../../../utils/redis');
const master = require('../../../data/masters/master');

module.exports = function () {
  it('should successfully get works', async () => {
    const response = await this.request();

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { works } = body;

    expect(works).toHaveLength(18);

    expect(works[0]).toHaveProperty('_id');
    expect(works[0]).toHaveProperty('title');

    const cachedData = await getCachedData(`id-${master._id.toString()}`, WORKS);

    expect(cachedData).not.toBeNull();
  });
};
