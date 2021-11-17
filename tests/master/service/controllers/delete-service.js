const Service = require('../../../../models/service');
const services = require('../../../data/services/services');
const {
  getServices,
  checkIsServiceCache,
  checkIsServiceCacheDeleted,
} = require('./utils/service-cache');

module.exports = function () {
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
