const { ObjectId } = require('mongodb');
const historyAppointment = require('../appointments/history-appointment');
const customer = require('../masters/customer');
const master = require('../masters/master');

module.exports = {
  _id: new ObjectId('61b81091002a6288aa8650bb'),
  appointmentId: historyAppointment._id,
  customerId: customer._id,
  masterId: master._id,
  comment: 'Интересный коммент',
  createdAt: new Date('2021-12-14T03:33:35.749Z'),
  value: 4,
};
