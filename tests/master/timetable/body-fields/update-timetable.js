const dataPreparation = require('../../../utils/data-preparation');
const date = require('./fields/date');
const sessionTime = require('./fields/session-time');
const endAt = require('./fields/end-at');
const startAt = require('./fields/start-at');
const type = require('./fields/type');
const weekends = require('./fields/weekends');
const exceptions = require('./fields/exceptions');
const manuallyAppointments = require('./fields/manually-appointments');
const wrapDataByObject = require('../../../utils/wrap-data-by-object');

const workingDayData = { startAt: 480, endAt: 1080 };

const autoData = {
  workingDay: workingDayData,
  weekends: [6],
  exceptions: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
};

const data = {
  sessionTime: 120,
  type: 'auto',
  auto: autoData,
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
  date: new Date('2023-09-28T00:00:00.000Z'),
};

const workingDay = [startAt, endAt];
const workingDayTests = dataPreparation(workingDay, workingDayData);
const wrappedWorkingDay = wrapDataByObject(workingDayTests, 'workingDay', autoData);

const weekendsAndExceptions = [weekends, exceptions];
const weekendsAndExceptionsTests = dataPreparation(weekendsAndExceptions, autoData);
const auto = [...weekendsAndExceptionsTests, ...wrappedWorkingDay];
const autoTests = wrapDataByObject(auto, 'auto', data);

const manuallyFields = [manuallyAppointments];
const manuallyTests = wrapDataByObject(manuallyFields, 'manually', data);

const update = [sessionTime, date, type];
const updateTests = dataPreparation(update, data);

const tests = [...autoTests, ...manuallyTests, ...updateTests];

module.exports = tests;
