const { ObjectId } = require('mongodb');
const master = require('../masters/master');
const master1 = require('../masters/master-1');

const appointments = [
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a19'),
    masterId: master._id,
    customerId: master1._id,
    service: {
      title: 'Smoe',
      parameter: '312',
      duration: 240,
      price: 3123,
      order: 0,
      subOrder: null,
      id: '5fc798eb321f4a09588b254c',
    },
    time: { startAt: 720, endAt: 960 },
    status: 'confirmed',
    date: new Date('2023-04-18T00:00:00Z'),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a17'),
    masterId: master._id,
    customerId: master1._id,
    service: {
      title: 'Smoe',
      parameter: '312',
      duration: 240,
      price: 3123,
      order: 0,
      subOrder: null,
      id: '5fc798eb321f4a09588b254c',
    },
    time: { startAt: 720, endAt: 960 },
    status: 'onConfirmation',
    date: new Date('2023-04-17T00:00:00Z'),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a15'),
    masterId: master._id,
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
    time: { startAt: 480, endAt: 840 },
    status: 'onConfirmed',
    date: new Date('2023-04-17T00:00:00Z'),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a10'),
    masterId: master._id,
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
    time: { startAt: 720, endAt: 1080 },
    status: 'history',
    date: new Date('2023-04-17T00:00:00Z'),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
];

module.exports = appointments;
