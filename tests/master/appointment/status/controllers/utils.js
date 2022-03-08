const dayjs = require('dayjs');
const app = require('../../../../../app');
const { getBookedAppointmentsCacheName } = require('../../../../../config/cache');
const { getCachedData } = require('../../../../../utils/redis');
const master = require('../../../../data/masters/master');
const ExtendedSupertest = require('../../../../extended-supertest');
const checkCache = require('../../../../utils/check-cache');

const template = '/api/v1/master/:masterId/appointment';

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'get',
};

const getBookedAppointments = new ExtendedSupertest(app, config);

const firstCacheKey = getBookedAppointmentsCacheName(master._id.toString());
const secondCacheKey = dayjs().startOf('day').utc(true).format();

const cacheKeys = [firstCacheKey, secondCacheKey];

const getCache = async () => await getCachedData(...cacheKeys);

const [checkIsCache, checkIsCacheDeleted] = checkCache(getCache);

module.exports = { getBookedAppointments, checkIsCache, checkIsCacheDeleted };
