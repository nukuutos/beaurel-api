const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const master = require('../../data/users/master');
const master1 = require('../../data/users/master-1');

const appointmentsCron = [
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
    history: [
      { status: 'onConfirmation', user: 'customer', date: new Date('2021-04-18T00:00:00Z') },
    ],
    time: { startAt: 720, endAt: 1080 },
    status: 'onConfirmation',
    date: dayjs().subtract(1, 'd').utc().toDate(),
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
    history: [
      { status: 'onConfirmation', user: 'customer', date: new Date('2021-04-18T00:00:00Z') },
    ],
    time: { startAt: 720, endAt: 1080 },
    status: 'confirmed',
    date: dayjs().subtract(1, 'd').utc().toDate(),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a17'),
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
    history: [
      { status: 'onConfirmation', user: 'customer', date: new Date('2021-04-18T00:00:00Z') },
    ],
    time: { startAt: 720, endAt: 1080 },
    status: 'unsuitable',
    date: dayjs().subtract(1, 'd').utc().toDate(),
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
    history: [
      { status: 'onConfirmation', user: 'customer', date: new Date('2021-04-18T00:00:00Z') },
    ],
    time: { startAt: 360, endAt: 720 },
    status: 'onConfirmation',
    date: dayjs().add(1, 'd').utc().toDate(),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
];

module.exports = appointmentsCron;
