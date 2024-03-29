const { INCORRECT_DURATION } = require('../../../../../config/errors/service');
const Service = require('../../../../../models/service');
const Timetable = require('../../../../../models/timetable');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');
const serviceParameter = require('../data/service-parameter');
const autoTimetable = require('../../data/auto-timetable');
const { getServices, checkIsCache, checkIsCacheDeleted } = require('./utils');

const data = { parameter: 'супер 21см', duration: 240, price: 12 };

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
    await Service.insertMany(serviceParameter);
    await Timetable.save(autoTimetable);
  });

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

    const { duration, price, parameter } = await Service.findOne(
      { parameter: data.parameter },
      { duration: 1, price: 1, parameter: 1 }
    );

    expect(duration).toBe(data.duration);
    expect(price).toBe(data.price);
    expect(parameter).toBe(data.parameter);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set(`${process.env.AUTH_HEADER}`, 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
