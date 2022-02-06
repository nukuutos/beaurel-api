const cloneDeep = require('lodash.clonedeep');
const { matchersWithOptions } = require('jest-json-schema');
const { ObjectId } = require('mongodb');
const {
  INCORRECT_EXCEPTIONS,
  INCORRECT_APPOINTMENTS,
  TIMETABLE_IS_EXISTED,
  NO_TIMEZONE,
} = require('../../../../config/errors/timetable');

const Timetable = require('../../../../models/timetable');
const autoTimetable = require('../../../data/timetables/auto-timetable');

const User = require('../../../../models/user');
const master = require('../../../data/masters/master');
const timetableSchema = require('../schemas/master-schema');

expect.extend(
  matchersWithOptions({
    verbose: true,
  })
);

const data = {
  sessionTime: 120,
  type: 'auto',
  auto: {
    workingDay: { startAt: 480, endAt: 1080 },
    weekends: [6],
    exceptions: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
  },
  manually: {
    appointments: {
      0: [],
      1: [600],
      2: [720],
      3: [],
      4: [720, 840],
      5: [600, 720, 960, 1080],
      6: [],
    },
  },
};

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
    await Timetable.deleteMany({});
  });

  it('should fail, timetable has already existed', async () => {
    await User.save(master);
    await Timetable.save(autoTimetable);

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(TIMETABLE_IS_EXISTED);
  });

  it('should fail, no timezone', async () => {
    const masterWithoutCity = cloneDeep(master);
    masterWithoutCity.city = null;

    await User.save(masterWithoutCity);

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(NO_TIMEZONE);
  });

  it('should fail, incorrect exceptions', async () => {
    await User.save(master);

    const dataWithInvalidExceptions = cloneDeep(data);

    dataWithInvalidExceptions.auto.exceptions = {
      0: [],
      1: [600, 720],
      2: [600, 700],
      3: [],
      4: [],
      5: [],
      6: [],
    };

    const response = await this.request().send(dataWithInvalidExceptions);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_EXCEPTIONS);
  });

  it('should fail, incorrect manually appointments', async () => {
    await User.save(master);

    const invalidData = cloneDeep(data);
    invalidData.type = 'manually';
    invalidData.manually.appointments = {
      0: [],
      1: [600, 720],
      2: [600, 700],
      3: [],
      4: [],
      5: [],
      6: [],
    };

    const response = await this.request().send(invalidData);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INCORRECT_APPOINTMENTS);
  });

  it('should successfully add timetable', async () => {
    await User.save(master);

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(201);

    const { _id } = body;

    const isId = ObjectId.isValid(_id);

    expect(isId).toBeTruthy();

    const timetable = await Timetable.findOne({});

    expect(timetable).toMatchSchema(timetableSchema);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
