const dataPreparation = require('../../../../../utils/data-preparation');
const endAt = require('./fields/end-at');
const startAt = require('./fields/start-at');
const serviceId = require('./fields/service-id');
const date = require('./fields/date');
const services = require('../../../data/services');

const appointment = {
  serviceId: services[0]._id,
  time: { startAt: 840, endAt: 930 },
  date: '2021-12-24T00:00:00.000Z',
};

const appointmentFields = [serviceId, date, startAt, endAt];
const tests = dataPreparation(appointmentFields, appointment);

module.exports = tests;
