const { TITLE_EXISTS, INCORRECT_DURATION } = require('../../../../config/errors/service');

const services = require('../../../data/services/services');

const {
  getServices,
  checkIsServiceCache,
  checkIsServiceCacheDeleted,
} = require('./utils/service-cache');

const data = {
  title: 'всё прекрасно',
  duration: 120,
  price: 321,
};

module.exports = function () {
  it('should fail, title already existed', async () => {
    const response = await this.request().send({ ...data, title: services[1].title });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(TITLE_EXISTS);
  });

  it('should fail, invalid duration', async () => {
    const response = await this.request().send({ ...data, duration: 90 });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_DURATION);
  });

  it('should successfully update service', async () => {
    await getServices.request();
    await checkIsServiceCache();

    const response = await this.request().send(data);

    await checkIsServiceCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(200);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
