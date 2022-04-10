const app = require('../../../../../app');
const { WORKS } = require('../../../../../config/cache');
const { getCachedData } = require('../../../../../utils/redis');
const master = require('../../../../data/users/master');
const ExtendedSupertest = require('../../../../extended-supertest');
const checkCache = require('../../../../utils/check-cache');

const template = `/api/v1/master/:masterId/work`;

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'get',
  user: master,
};

const getWorks = new ExtendedSupertest(app, config);

const cacheKeys = [`id-${master._id.toString()}`, WORKS];

const getCache = async () => await getCachedData(...cacheKeys);

const [checkIsCache, checkIsCacheDeleted] = checkCache(getCache);

module.exports = { getWorks, checkIsCache, checkIsCacheDeleted };
