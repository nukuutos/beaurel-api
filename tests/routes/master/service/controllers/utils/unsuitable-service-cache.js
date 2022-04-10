const app = require('../../../../../../app');
const { UNSUITABLE_SERVICES } = require('../../../../../../config/cache');
const { getCachedData } = require('../../../../../../utils/redis');
const master = require('../../../../../data/users/master');
const ExtendedSupertest = require('../../../../../extended-supertest');
const checkCache = require('../../../../../utils/check-cache');

const template = '/api/v1/master/:masterId/service/update';

const config = {
  routeParams: { masterId: master._id.toString() },
  template,
  method: 'get',
  user: master,
};

const getUnsuitableServices = new ExtendedSupertest(app, config);

const cacheKeys = [`id-${master._id.toString()}`, UNSUITABLE_SERVICES];

const getCache = async () => await getCachedData(...cacheKeys);

const [checkIsUnsuitableServiceCache, checkIsUnsuitableServiceCacheDeleted] = checkCache(getCache);

module.exports = {
  getUnsuitableServices,
  checkIsUnsuitableServiceCache,
  checkIsUnsuitableServiceCacheDeleted,
};
