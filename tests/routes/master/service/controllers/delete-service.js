const Service = require('../../../../../models/service');
const Timetable = require('../../../../../models/timetable');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');
const services = require('../../data/services');
const autoTimetable = require('../../data/auto-timetable');
const {
  getServices,
  checkIsServiceCache,
  checkIsServiceCacheDeleted,
} = require('./utils/service-cache');

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
    await Service.insertMany(services);
    await Timetable.save(autoTimetable);
  });

  it('should successfully delete service', async () => {
    await getServices.request();
    await checkIsServiceCache();

    const response = await this.request();

    await checkIsServiceCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const dbData = await Service.findOne({ _id: services[0]._id });

    expect(dbData).toBeNull();
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
