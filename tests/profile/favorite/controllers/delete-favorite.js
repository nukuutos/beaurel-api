const Favorite = require('../../../../logic/profile/favorite');
const master = require('../../../data/masters/master');
const { checkIsCache, checkIsCacheDeleted, getFavorites } = require('./utils');

module.exports = function () {
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
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
