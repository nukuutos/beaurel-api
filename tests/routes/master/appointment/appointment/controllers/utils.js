const dayjs = require('dayjs');
const app = require('../../../../../../app');
const { getBookedAppointmentsCacheName } = require('../../../../../../config/cache');
const { getCachedData } = require('../../../../../../utils/redis');
const master = require('../../../../../data/users/master');
const ExtendedSupertest = require('../../../../../extended-supertest');
const checkCache = require('../../../../../utils/check-cache');

const template = '/api/v1/master/:masterId/timetable/booking';

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'get',
};

const getBookingData = new ExtendedSupertest(app, config);

const secondCacheKey = dayjs().startOf('week').utc(true).format();

const cacheKeys = [getBookedAppointmentsCacheName(master._id.toString()), secondCacheKey];

const getCache = async () => await getCachedData(...cacheKeys);

const [checkIsCache, checkIsCacheDeleted] = checkCache(getCache);

module.exports = { getBookingData, checkIsCache, checkIsCacheDeleted };
