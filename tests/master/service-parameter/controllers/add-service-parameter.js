const cloneDeep = require('lodash.clonedeep');
const { ObjectId } = require('mongodb');
const {
  TITLE_EXISTS,
  INCORRECT_DURATION,
  NO_UPDATE_DURATION,
  SERVICE_LIMIT,
} = require('../../../../config/errors/service');
const Service = require('../../../../models/service');
const Timetable = require('../../../../models/timetable');
const User = require('../../../../models/user');
const servicesLimit = require('../../../data/services/services-limit');
const autoTimetableWithUpdate = require('../../../data/timetables/auto-timetable-with-update');
const { getServices, checkIsCache, checkIsCacheDeleted } = require('./utils');

const data = {
  title: 'скукота',
  subServices: [
    { parameter: 'супер 21см', duration: 120, price: 1234 },
    { parameter: 'супер 21см', duration: 240, price: 1234 },
  ],
};

module.exports = function () {
  beforeEach(async () => {
    await Service.deleteMany({});
  });

  it('should successfully add service parameter', async () => {
    await getServices.request();
    await checkIsCache();

    const response = await this.request().send(data);

    await checkIsCacheDeleted();

    const { statusCode, body } = response;

    expect(statusCode).toBe(201);

    const { ids } = body;

    const idsArray = Object.values(ids);

    expect(idsArray).toHaveLength(2);

    const isValidIds = idsArray.every((id) => ObjectId.isValid(id));

    expect(isValidIds).toBeTruthy();

    await Service.deleteMany({});

    await this.request().send(data);

    const user = await User.findOne({}, { 'tools.isServices': 1 });

    expect(user.tools.isServices).toBeTruthy();
  });

  it('should fail, title already existed', async () => {
    await this.request().send(data);
    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(TITLE_EXISTS);
  });

  it('should fail, services limit', async () => {
    await Service.insertMany(servicesLimit);
    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(SERVICE_LIMIT);
  });

  it('should fail, sub services limit', async () => {
    const clonedData = cloneDeep(data);

    for (let i = 2; i <= 10; i++) {
      clonedData.subServices.push({ parameter: 'супер 21см', duration: 240, price: 1234 });
    }

    const response = await this.request().send(clonedData);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(SERVICE_LIMIT);
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

  it('should detect that request must have updateDuration field', async () => {
    Timetable.deleteMany({});
    Timetable.save(autoTimetableWithUpdate);

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(NO_UPDATE_DURATION);
  });

  it('should successfully add service with update', async () => {
    await Timetable.deleteMany({});
    await Timetable.save(autoTimetableWithUpdate);

    const subServiceWithUpdate = data.subServices.map((subService) => ({
      ...subService,
      updateDuration: 90,
    }));

    const dataWithUpdate = { ...data, subServices: subServiceWithUpdate };

    const response = await this.request().send(dataWithUpdate);

    const { statusCode, body } = response;

    expect(statusCode).toBe(201);

    const { ids } = body;

    const idsArray = Object.values(ids);

    const service = await Service.findOne({ _id: new ObjectId(idsArray[0]) });

    expect(service.duration).toBe(120);
    expect(service.update.status).toBe('suitable');
    expect(service.update.duration).toBe(90);
    expect(service.update.date).toEqual(autoTimetableWithUpdate.update.date);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
