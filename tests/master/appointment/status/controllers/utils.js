const app = require('../../../../../app');
const { TIMETABLE_AND_APPOINTMENTS } = require('../../../../../config/cache');
const { getCachedData } = require('../../../../../utils/redis');
const master = require('../../../../data/masters/master');
const ExtendedSupertest = require('../../../../extended-supertest');
const checkCache = require('../../../../utils/check-cache');

const template = '/api/v1/master/:masterId/timetable/booking';

const config = {
  template,
  routeParams: { masterId: master._id.toString() },
  method: 'get',
};

const getBookingData = new ExtendedSupertest(app, config);

const cacheKeys = [`id-${master._id.toString()}`, TIMETABLE_AND_APPOINTMENTS];

const getCache = async () => await getCachedData(...cacheKeys);

const [checkIsCache, checkIsCacheDeleted] = checkCache(getCache);

module.exports = { getBookingData, checkIsCache, checkIsCacheDeleted };
