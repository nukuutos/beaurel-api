const { MASTER_IS_FRIEND, NO_MASTER } = require('../../../../config/errors/favorite');
const Favorite = require('../../../../models/user/favorite-controller');
const master = require('../../../data/masters/master');
const { getFavorites, checkIsCache, checkIsCacheDeleted } = require('./utils');

module.exports = function () {
  it('should successfully add favorite', async () => {
    await getFavorites.request();

    await checkIsCache();

    const response = await this.request();

    await checkIsCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(204);

    const dbData = await Favorite.getFavoriteMasters(master._id);

    expect(dbData).toHaveProperty('masters');
    expect(dbData).toHaveProperty('ids');

    expect(dbData.masters.length).toBe(3);
    expect(dbData.ids.length).toBe(3);
  });

  it('should detect that master has already favorite', async () => {
    const response = await this.request();

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(MASTER_IS_FRIEND);
  });

  it('should detect that master has not existed', async () => {
    const notExistedMaster = { masterId: `5eb849b81c2ccc21306ced78` };

    const response = await this.request(notExistedMaster);

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(NO_MASTER);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
