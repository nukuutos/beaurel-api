const {
  INCORRECT_SERVICES_FOR_UPDATE,
  INCORRECT_DURATION,
} = require('../../../../config/errors/service');

const updateForServices = require('../../../data/services/update-for-services');

const {
  getServices,
  checkIsServiceCache,
  checkIsServiceCacheDeleted,
} = require('./utils/service-cache');

const {
  getUnsuitableServices,
  checkIsUnsuitableServiceCache,
  checkIsUnsuitableServiceCacheDeleted,
} = require('./utils/unsuitable-service-cache');

module.exports = function () {
  it('should fail, incorrect services length', async () => {
    const [withoutOneService, ...services] = updateForServices;

    const response = await this.request().send({ services });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_SERVICES_FOR_UPDATE);
  });

  it('should fail, invalid id of one service', async () => {
    const services = updateForServices.map((service) => ({ ...service }));
    services[0].id = '6121fc858fce2120c8c41b68';

    const response = await this.request().send({ services });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_SERVICES_FOR_UPDATE);
  });

  it('should fail, invalid duration of one service', async () => {
    const services = updateForServices.map((service) => ({ ...service }));
    services[0].duration = 120;

    const response = await this.request().send({ services });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_DURATION);
  });

  it('should successfully update service', async () => {
    await getUnsuitableServices.request();
    await getServices.request();

    await checkIsServiceCache();
    await checkIsUnsuitableServiceCache();

    const response = await this.request().send({ services: updateForServices });

    await checkIsServiceCacheDeleted();
    await checkIsUnsuitableServiceCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(200);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
