const { INCORRECT_DURATION } = require('../../../../config/errors/service');
const ServiceParameter = require('../../../../models/service/service-parameter');
const { getServices, checkIsCache, checkIsCacheDeleted } = require('./utils');

const data = { parameter: 'супер 21см', duration: 240, price: 12 };

module.exports = function () {
  it('should fail, invalid duration', async () => {
    await getServices.request();
    await checkIsCache();

    const response = await this.request().send({ ...data, duration: 90 });

    await checkIsCacheDeleted();

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_DURATION);
  });

  it('should successfully update sub service', async () => {
    const response = await this.request().send(data);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const { duration, price, parameter } = await ServiceParameter.findOne(
      { parameter: data.parameter },
      { duration: 1, price: 1, parameter: 1 }
    );

    expect(duration).toBe(data.duration);
    expect(price).toBe(data.price);
    expect(parameter).toBe(data.parameter);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
