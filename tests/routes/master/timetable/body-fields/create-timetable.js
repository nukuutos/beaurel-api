const dataPreparation = require('../../../../utils/data-preparation');
const sessionTime = require('./fields/session-time');
const endAt = require('./fields/end-at');
const startAt = require('./fields/start-at');
const type = require('./fields/type');
const weekends = require('./fields/weekends');
const exceptions = require('./fields/exceptions');
const manuallyAppointments = require('./fields/manually-appointments');

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
};

const fields = [startAt, endAt, sessionTime, type, weekends, exceptions, manuallyAppointments];

const tests = dataPreparation(fields, data);

module.exports = tests;
