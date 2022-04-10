const ServiceParameter = require('../../../../../models/service-parameter');
const Timetable = require('../../../../../models/timetable');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');
const serviceParameter = require('../data/service-parameter');
const autoTimetable = require('../../data/auto-timetable');
const { checkIsCacheDeleted, getServices, checkIsCache } = require('./utils');

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
    await ServiceParameter.insertMany(serviceParameter);
    await Timetable.save(autoTimetable);
  });

  it('should successfully delete service', async () => {
    await getServices.request();
    await checkIsCache();

    const response = await this.request();

    await checkIsCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const dbData = await ServiceParameter.findOne({ _id: serviceParameter[0]._id });

    expect(dbData).toBeNull();
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
