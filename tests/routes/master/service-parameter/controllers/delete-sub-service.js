const Service = require('../../../../../models/service');
const Timetable = require('../../../../../models/timetable');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');
const serviceParameter = require('../data/service-parameter');
const autoTimetable = require('../../data/auto-timetable');
const { checkIsCacheDeleted, getServices, checkIsCache } = require('./utils');

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
    await Service.insertMany(serviceParameter);
    await Timetable.save(autoTimetable);
  });

  it('should successfully delete service', async () => {
    await getServices.request();
    await checkIsCache();

    const response = await this.request();

    await checkIsCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const dbData = await Service.findOne({ _id: serviceParameter[0]._id });

    expect(dbData).toBeNull();
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set(`${process.env.AUTH_HEADER}`, 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
