const { TITLE_EXISTS } = require('../../../../../config/errors/service');
const ServiceParameter = require('../../../../../models/service-parameter');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');
const serviceParameter = require('../data/service-parameter');
const { getServices, checkIsCache, checkIsCacheDeleted } = require('./utils');

const data = { title: 'Супер услуга' };

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
    await ServiceParameter.insertMany(serviceParameter);
  });

  it('should fail, title already existed', async () => {
    const response = await this.request().send({ title: 'дубликат' });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(TITLE_EXISTS);
  });

  it('should successfully update service parameter title', async () => {
    await getServices.request();
    await checkIsCache();

    const response = await this.request().send(data);

    await checkIsCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const subServices = await ServiceParameter.find({ title: data.title });

    expect(subServices).toHaveLength(4);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};