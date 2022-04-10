const app = require('../../../../../app');
const { SERVICES_AND_TIMETABLE } = require('../../../../../config/cache');
const { getCachedData } = require('../../../../../utils/redis');
const master = require('../../../../data/users/master');
const ExtendedSupertest = require('../../../../extended-supertest');
const checkCache = require('../../../../utils/check-cache');

const template = '/api/v1/master/:masterId/service';

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'get',
};

const getServices = new ExtendedSupertest(app, config);

const cacheKeys = [`id-${master._id.toString()}`, SERVICES_AND_TIMETABLE];

const getCache = async () => await getCachedData(...cacheKeys);

const [checkIsCache, checkIsCacheDeleted] = checkCache(getCache);

module.exports = { getServices, checkIsCache, checkIsCacheDeleted };
