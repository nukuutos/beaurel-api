const dataPreparation = require('../../../../utils/data-preparation');
const endAt = require('./fields/end-at');
const startAt = require('./fields/start-at');
const serviceId = require('./fields/service-id');
const date = require('./fields/date');
const services = require('../../../../data/services/services');
const wrapDataByObject = require('../../../../utils/wrap-data-by-object');

const time = { startAt: 840, endAt: 930 };
const appointment = {
  serviceId: services[0]._id,
  time,
  date: '2021-12-24T00:00:00.000Z',
};

const timeFields = [startAt, endAt];
const timeTests = dataPreparation(timeFields, time);
const wrappedTimeTests = wrapDataByObject(timeTests, 'time', appointment);

const appointmentFields = [serviceId, date];
const appointmentTests = dataPreparation(appointmentFields, appointment);

const tests = [...appointmentTests, ...wrappedTimeTests];

module.exports = tests;
