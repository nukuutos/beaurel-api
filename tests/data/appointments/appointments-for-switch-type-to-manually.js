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
      duration: 360,
      price: 3123,
      order: 0,
      subOrder: null,
      id: '5fc798eb321f4a09588b254c',
    },
    time: { startAt: 720, endAt: 1080 },
    status: 'confirmed',
    date: new Date('2023-04-18T00:00:00Z'), // tue (+)
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a18'),
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
    status: 'onConfirmation',
    date: new Date('2023-04-17T00:00:00Z'), // mon (+)
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a04018b97a17'),
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
    status: 'confirmed',
    date: new Date('2023-04-19T00:00:00Z'), // wen
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a00418b79a17'),
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
    status: 'confirmed',
    date: new Date('2023-04-21T00:00:00Z'), // fri
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6702f6a7ce01a00418b79a17'),
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
    status: 'confirmed',
    date: new Date('2023-04-22T00:00:00Z'), // sat
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6702f6a7ce0a100418b79a17'),
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
    status: 'confirmed',
    date: new Date('2023-04-23T00:00:00Z'), // sun (+)
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a16'),
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
    time: { startAt: 360, endAt: 720 },
    status: 'history',
    date: new Date('2021-04-17T00:00:00Z'),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
];

module.exports = appointments;
