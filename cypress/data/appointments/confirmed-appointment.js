const { ObjectId } = require('mongodb');
const customer = require('../masters/customer');
const master = require('../masters/master');

module.exports = {
  _id: new ObjectId('6072f6a7ce01a00418b97a19'),
  masterId: master._id,
  customerId: customer._id,
  service: {
    title: 'Smoe',
    parameter: '312',
    duration: 120,
    price: 3123,
    order: 0,
    subOrder: null,
    id: '5fc798eb321f4a09588b254c',
  },
  time: { startAt: 480, endAt: 600 },
  isViewed: { master: false, customer: false },
  status: 'confirmed',
  date: new Date('2024-04-18T00:00:00Z'),
  createdAt: new Date('2021-04-11T13:16:23.000Z'),
};
