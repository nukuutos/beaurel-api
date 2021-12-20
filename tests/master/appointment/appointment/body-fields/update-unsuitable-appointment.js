const dataPreparation = require('../../../../utils/data-preparation');
const endAt = require('./fields/end-at');
const startAt = require('./fields/start-at');
const duration = require('./fields/duration');
const date = require('./fields/date');
const wrapDataByObject = require('../../../../utils/wrap-data-by-object');

const time = { startAt: 600, endAt: 720 };
const appointment = {
  time,
  duration: 120,
  date: '2021-12-24T00:00:00.000Z',
};

const timeFields = [startAt, endAt];
const timeTests = dataPreparation(timeFields, time);
const wrappedTimeTests = wrapDataByObject(timeTests, 'time', appointment);

const appointmentFields = [duration, date];
const appointmentTests = dataPreparation(appointmentFields, appointment);

const tests = [...appointmentTests, ...wrappedTimeTests];

module.exports = tests;
