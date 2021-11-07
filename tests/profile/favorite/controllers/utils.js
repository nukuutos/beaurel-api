const app = require('../../../../app');
const { FAVORITES } = require('../../../../config/cache');
const { getCachedData } = require('../../../../utils/redis');
const master = require('../../../data/masters/master');
const ExtendedSupertest = require('../../../extended-supertest');
const checkCache = require('../../../utils/check-cache');

const template = '/api/v1/profile/:profileId/favorite';
const config = {
  template,
  routeParams: { profileId: master._id.toString() },
  method: 'get',
  user: master,
};

const getFavorites = new ExtendedSupertest(app, config);

const cacheKeys = [`id-${master._id.toString()}`, FAVORITES];

const getCache = async () => await getCachedData(...cacheKeys);

const [checkIsCache, checkIsCacheDeleted] = checkCache(getCache);

module.exports = { getFavorites, checkIsCache, checkIsCacheDeleted };
