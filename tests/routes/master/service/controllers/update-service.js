const { TITLE_EXISTS, INCORRECT_DURATION } = require('../../../../../config/errors/service');
const Service = require('../../../../../models/service');
const Timetable = require('../../../../../models/timetable');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');

const services = require('../../data/services');
const autoTimetable = require('../../data/auto-timetable');

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
  beforeAll(async () => {
    await User.save(master);
    await Service.insertMany(services);
    await Timetable.save(autoTimetable);
  });

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
    const response = await this.request().set(`${process.env.AUTH_HEADER}`, 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
