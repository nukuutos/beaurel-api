const { ObjectId } = require('mongodb');
const { TITLE_EXISTS, INCORRECT_DURATION } = require('../../../../config/errors/service');

const {
  getServices,
  checkIsServiceCache,
  checkIsServiceCacheDeleted,
} = require('./utils/service-cache');

const data = {
  title: 'Супер услуга',
  duration: 120,
  price: 321,
};

module.exports = function () {
  it('should successfully add service', async () => {
    await getServices.request();
    await checkIsServiceCache();

    const response = await this.request().send(data);

    await checkIsServiceCacheDeleted();

    const { statusCode, body } = response;

    expect(statusCode).toBe(201);

    const { id } = body;

    expect(ObjectId.isValid(id)).toBeTruthy();
  });

  it('should fail, title already existed', async () => {
    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(TITLE_EXISTS);
  });

  it('should fail, invalid duration', async () => {
    const response = await this.request().send({ ...data, title: 'чтооооо', duration: 90 });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_DURATION);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
