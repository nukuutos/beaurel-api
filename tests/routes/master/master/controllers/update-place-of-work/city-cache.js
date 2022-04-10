const app = require('../../../../../../app');
const { CITY } = require('../../../../../../config/cache');
const { getCachedData } = require('../../../../../../utils/redis');
const master = require('../../../../../data/users/master');
const ExtendedSupertest = require('../../../../../extended-supertest');
const checkCache = require('../../../../../utils/check-cache');

const template = '/api/v1/profile/:profileId/city';

const config = {
  template,
  routeParams: { profileId: master._id.toString() },
  method: 'get',
  user: master,
};

const getCity = new ExtendedSupertest(app, config);

const cacheKeys = [`id-${master._id.toString()}`, CITY];

const getCache = async () => await getCachedData(...cacheKeys);

const [checkIsCityCache, checkIsCityCacheDeleted] = checkCache(getCache);

module.exports = { getCity, checkIsCityCache, checkIsCityCacheDeleted };
