const ServiceParameter = require('../../../../models/service/service-parameter');
const serviceParameter = require('../../../data/services/service-parameter');
const { getServices, checkIsCache, checkIsCacheDeleted } = require('./utils');

module.exports = function () {
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

    expect(subServicesWithDeletedParameter.length).toBe(0);

    const services = await ServiceParameter.find({});

    expect(services.length).toBe(1);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
