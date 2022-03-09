const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

const master = require('../masters/master');

const bookedAppointments = [
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a19'),
    masterId: master._id,
    customerId: master._id,
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
    date: dayjs().startOf('week').add(1, 'day').utc(true).toDate(),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a18'),
    masterId: master._id,
    customerId: master._id,
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
    date: dayjs().startOf('week').add(1, 'week').utc(true).toDate(),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a17'),
    masterId: master._id,
    customerId: master._id,
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
    date: dayjs().startOf('week').add(1, 'week').utc(true).toDate(),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a16'),
    masterId: master._id,
    customerId: master._id,
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
    date: dayjs().startOf('week').add(5, 'week').subtract(1, 'day').utc(true).toDate(),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a15'),
    masterId: master._id,
    customerId: master._id,
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
    date: dayjs().startOf('week').add(5, 'week').utc(true).toDate(),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
];

module.exports = bookedAppointments;
