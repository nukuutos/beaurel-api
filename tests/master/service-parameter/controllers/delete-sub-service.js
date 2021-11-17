const ServiceParameter = require('../../../../models/service-parameter');
const serviceParameter = require('../../../data/services/service-parameter');
const { checkIsCacheDeleted, getServices, checkIsCache } = require('./utils');

module.exports = function () {
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
