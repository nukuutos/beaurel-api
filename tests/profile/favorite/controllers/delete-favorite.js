const Favorite = require('../../../../logic/profile/favorite');
const master = require('../../../data/masters/master');
const { checkIsCache, checkIsCacheDeleted, getFavorites } = require('./utils');

module.exports = function () {
  it('should successfully delete favorite', async () => {
    await getFavorites.request();

    await checkIsCache();

    const response = await this.request();

    await checkIsCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(204);

    const dbData = await Favorite.getMasters(master._id);

    expect(dbData).toHaveProperty('masters');
    expect(dbData).toHaveProperty('ids');

    expect(dbData.masters.length).toBe(1);
    expect(dbData.ids.length).toBe(1);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
