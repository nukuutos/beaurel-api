const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const master = require('../../../../../data/users/master');
const master1 = require('../../../../../data/users/master-1');

const appointmentsForBooking = [
  {
    _id: new ObjectId('6172f6a7ce01a00418b97a18'),
    masterId: master._id,
    customerId: master1._id,
    history: [
      { status: 'onConfirmation', user: 'customer', date: new Date('2021-04-18T00:00:00Z') },
    ],
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
    date: dayjs().add(1, 'week').startOf('day').utc(true).toDate(),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a19'),
    masterId: master._id,
    customerId: master1._id,
    history: [
      { status: 'onConfirmation', user: 'customer', date: new Date('2021-04-18T00:00:00Z') },
    ],
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
    date: dayjs().add(2, 'week').startOf('day').utc(true).toDate(),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a17'),
    masterId: master._id,
    customerId: master1._id,
    history: [
      { status: 'onConfirmation', user: 'customer', date: new Date('2021-04-18T00:00:00Z') },
    ],
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
    date: new Date('2023-04-19T00:00:00Z'),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a16'),
    masterId: master._id,
    customerId: master1._id,
    history: [
      { status: 'onConfirmation', user: 'customer', date: new Date('2021-04-18T00:00:00Z') },
    ],
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
    status: 'unsuitable',
    date: new Date('2023-04-17T00:00:00Z'),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6073f6a7ce01a00418b97a16'),
    masterId: master._id,
    customerId: master1._id,
    history: [
      { status: 'onConfirmation', user: 'customer', date: new Date('2021-04-18T00:00:00Z') },
    ],
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
    status: 'cancelled',
    date: new Date('2023-04-17T00:00:00Z'),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6074f6a7ce01a00418b97a16'),
    masterId: master._id,
    customerId: master1._id,
    history: [
      { status: 'onConfirmation', user: 'customer', date: new Date('2021-04-18T00:00:00Z') },
    ],
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
    status: 'rejected',
    date: new Date('2023-04-17T00:00:00Z'),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
];

module.exports = appointmentsForBooking;
