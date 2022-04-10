const ServiceParameter = require('../../../../../models/service-parameter');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');
const serviceParameter = require('../data/service-parameter');
const { getServices, checkIsCache, checkIsCacheDeleted } = require('./utils');

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
    await ServiceParameter.insertMany(serviceParameter);
  });

  it('should successfully delete service parameter', async () => {
    await getServices.request();
    await checkIsCache();

    const response = await this.request();

    await checkIsCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const subServicesWithDeletedParameter = await ServiceParameter.find({
      title: serviceParameter[0].title,
    });

    expect(subServicesWithDeletedParameter).toHaveLength(0);

    const services = await ServiceParameter.find({});

    expect(services).toHaveLength(1);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
