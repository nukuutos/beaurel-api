const { ObjectId } = require('mongodb');
const { TITLE_EXISTS, INCORRECT_DURATION } = require('../../../../config/errors/service');
const { getServices, checkIsCache, checkIsCacheDeleted } = require('./utils');

const data = {
  title: 'скукота',
  subServices: [
    { parameter: 'супер 21см', duration: 120, price: 1234 },
    { parameter: 'супер 21см', duration: 240, price: 1234 },
  ],
};

module.exports = function () {
  it('should successfully add service parameter', async () => {
    await getServices.request();
    await checkIsCache();

    const response = await this.request().send(data);

    await checkIsCacheDeleted();

    const { statusCode, body } = response;

    expect(statusCode).toBe(201);

    const { ids } = body;

    const idsArray = Object.values(ids);

    expect(idsArray.length).toBe(2);

    const isValidIds = idsArray.every((id) => ObjectId.isValid(id));

    expect(isValidIds).toBeTruthy();
  });

  it('should fail, title already existed', async () => {
    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(TITLE_EXISTS);
  });

  it('should fail, invalid duration', async () => {
    const response = await this.request().send({
      ...data,
      title: 'чтооооо',
      subServices: [{ parameter: 'супер 21см', duration: 90, price: 1234 }],
    });

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
