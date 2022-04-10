const app = require('../../../../../../app');
const { getFavoritesCacheName } = require('../../../../../../config/cache');
const { getCachedData } = require('../../../../../../utils/redis');
const master = require('../../../../../data/users/master');
const ExtendedSupertest = require('../../../../../extended-supertest');
const checkCache = require('../../../../../utils/check-cache');

const template = '/api/v1/profile/:profileId/favorite';
const config = {
  template,
  routeParams: { profileId: master._id.toString() },
  method: 'get',
  user: master,
};

const getFavorites = new ExtendedSupertest(app, config);

const cacheKeys = [getFavoritesCacheName(master._id.toString()), 0];

const getCache = async () => await getCachedData(...cacheKeys);

const [checkIsCache, checkIsCacheDeleted] = checkCache(getCache);

module.exports = { getFavorites, checkIsCache, checkIsCacheDeleted };
