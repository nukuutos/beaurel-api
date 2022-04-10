const dataPreparation = require('../../../../../utils/data-preparation');
const endAt = require('./fields/end-at');
const startAt = require('./fields/start-at');
const duration = require('./fields/duration');
const date = require('./fields/date');

const appointment = {
  time: { startAt: 600, endAt: 720 },
  duration: 120,
  date: '2021-12-24T00:00:00.000Z',
};

const appointmentFields = [duration, date, startAt, endAt];
const tests = dataPreparation(appointmentFields, appointment);

module.exports = tests;
