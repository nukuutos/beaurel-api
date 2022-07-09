const app = require('../../../../../../app');
const { getReviewsCacheName } = require('../../../../../../config/cache');
const { getCachedData } = require('../../../../../../utils/redis');
const master = require('../../../../../data/users/master');
const ExtendedSupertest = require('../../../../../extended-supertest');
const checkCache = require('../../../../../utils/check-cache');

const template = '/api/v1/master/:masterId/review';

const config = {
  template,
  method: 'get',
  routeParams: { masterId: master._id.toString() },
};

const getReviewsData = new ExtendedSupertest(app, config);

const firstCacheKey = getReviewsCacheName(master._id.toString());
const secondCacheKey = 0; // page

const cacheKeys = [firstCacheKey, secondCacheKey];

const getCache = async () => await getCachedData(...cacheKeys);

const [checkIsCache, checkIsCacheDeleted] = checkCache(getCache);

module.exports = { getReviewsData, checkIsCache, checkIsCacheDeleted };
