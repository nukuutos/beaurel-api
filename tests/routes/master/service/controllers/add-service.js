const { ObjectId } = require('mongodb');
const {
  TITLE_EXISTS,
  INCORRECT_DURATION,
  NO_UPDATE_DURATION,
  SERVICE_LIMIT,
} = require('../../../../../config/errors/service');
const Service = require('../../../../../models/service');
const Timetable = require('../../../../../models/timetable');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');
const servicesLimit = require('../../data/services-limit');
const autoTimetable = require('../../data/auto-timetable');
const autoTimetableWithUpdate = require('../../data/auto-timetable-with-update');

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
  beforeAll(async () => {
    await User.save(master);
  });

  beforeEach(async () => {
    await Service.deleteMany({});
    await Timetable.deleteMany({});
  });

  it('should successfully add service', async () => {
    await Timetable.save(autoTimetable);

    await getServices.request();
    await checkIsServiceCache();

    const response = await this.request().send(data);

    await checkIsServiceCacheDeleted();

    const { statusCode, body } = response;

    expect(statusCode).toBe(201);

    const { id } = body;

    expect(ObjectId.isValid(id)).toBeTruthy();

    await Service.deleteMany({});

    await this.request().send(data);

    const user = await User.findOne({}, { 'tools.isServices': 1 });

    expect(user.tools.isServices).toBeTruthy();
  });

  it('should fail, services limit', async () => {
    await Timetable.save(autoTimetable);
    await Service.insertMany(servicesLimit);

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(SERVICE_LIMIT);
  });

  it('should fail, title already existed', async () => {
    await Timetable.save(autoTimetable);

    await this.request().send(data);
    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(TITLE_EXISTS);
  });

  it('should fail, invalid duration', async () => {
    await Timetable.save(autoTimetable);

    const response = await this.request().send({ ...data, title: 'чтооооо', duration: 90 });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_DURATION);
  });

  it('should detect that request must have updateDuration field', async () => {
    await Timetable.save(autoTimetableWithUpdate);

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(NO_UPDATE_DURATION);
  });

  it('should successfully add service with update', async () => {
    await Timetable.save(autoTimetableWithUpdate);

    const dataWithUpdate = { ...data, updateDuration: 90 };

    const response = await this.request().send(dataWithUpdate);

    const { statusCode, body } = response;

    expect(statusCode).toBe(201);

    const { id } = body;

    expect(ObjectId.isValid(id)).toBeTruthy();

    const service = await Service.findOne({ _id: new ObjectId(id) });

    expect(service.duration).toBe(120);
    expect(service.update.status).toBe('suitable');
    expect(service.update.duration).toBe(90);
    expect(service.update.date).toEqual(autoTimetableWithUpdate.update.date);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set(`${process.env.AUTH_HEADER}`, 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
