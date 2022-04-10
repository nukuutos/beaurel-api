const Favorite = require('../../../../../../logic/profile/favorite');
const User = require('../../../../../../models/user');
const master = require('../../../../../data/users/master');
const master1 = require('../../../../../data/users/master-1');
const master2 = require('../../../../../data/users/master-2');
const { checkIsCache, checkIsCacheDeleted, getFavorites } = require('../utils/cache');
const checkData = require('./check-data');

module.exports = function () {
  beforeAll(async () => {
    await User.insertMany([master, master1, master2]);
  });

  it('should successfully delete favorite', async () => {
    const page = 0;

    await getFavorites.request().query({ page });

    await checkIsCache();

    const response = await this.request();

    await checkIsCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(204);

    const dbData = await Favorite.getMasters(master._id, page);

    expect(dbData).toHaveLength(1);

    await checkData();
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
