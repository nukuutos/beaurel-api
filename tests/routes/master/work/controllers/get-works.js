const { WORKS } = require('../../../../../config/cache');
const User = require('../../../../../models/user');
const Work = require('../../../../../models/work');
const { getCachedData } = require('../../../../../utils/redis');
const master = require('../../../../data/users/master');
const works = require('../data/works');

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
    await Work.insertMany(works);
  });

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
