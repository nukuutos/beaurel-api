const { ObjectId } = require('mongodb');
const master1 = require('../../../data/users/master-1');
const moscowMaster = require('./moscow-master');

const moscowAppointmentsSameDate = [
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a19'),
    masterId: moscowMaster._id,
    customerId: master1._id,
    service: {
      title: 'Smoe',
      parameter: '312',
      duration: 360,
      price: 3123,
      order: 0,
      subOrder: null,
      id: '5fc798eb321f4a09588b254c',
    },
    history: [
      { status: 'onConfirmation', user: 'customer', date: new Date('2021-04-18T00:00:00Z') },
    ],
    time: { startAt: 500, endAt: 860 },
    status: 'onConfirmation',
    date: new Date('2023-11-16T21:00:00Z'),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a18'),
    masterId: moscowMaster._id,
    customerId: master1._id,
    service: {
      title: 'Smoe',
      parameter: '312',
      duration: 360,
      price: 3123,
      order: 0,
      subOrder: null,
      id: '5fc798eb321f4a09588b254c',
    },
    history: [
      { status: 'onConfirmation', user: 'customer', date: new Date('2021-04-18T00:00:00Z') },
    ],
    time: { startAt: 700, endAt: 1060 },
    status: 'onConfirmation',
    date: new Date('2023-11-15T21:00:00Z'),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
];

module.exports = moscowAppointmentsSameDate;
