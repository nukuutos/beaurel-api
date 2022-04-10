const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const master1 = require('../../../data/users/master-1');
const moscowMaster = require('./moscow-master');

const getTomorrowMoscowUTC = () => {
  // if tomorrow 2023-12-22 => 2023-12-21T21:00:00.000Z
  const date = dayjs().utc().startOf('day').add(1, 'd').tz('Europe/Moscow');
  const offset = date.utcOffset();
  const result = date.utc().subtract(offset, 'minute');
  return result.toDate();
};

const getTodayMoscowUTC = () => {
  // if today 2023-12-22 => 2023-12-21T21:00:00.000Z
  const date = dayjs().utc().startOf('day').tz('Europe/Moscow');
  const offset = date.utcOffset();
  const result = date.utc().subtract(offset, 'minute');
  return result.toDate();
};

const getYesterdayMoscowUTC = () => {
  // if today 2023-12-22 => 2023-12-21T21:00:00.000Z
  const date = dayjs().utc().startOf('day').tz('Europe/Moscow');
  const offset = date.utcOffset();
  const result = date.utc().subtract(offset, 'minute');
  return result.toDate();
};

const moscowBookedAppointments = [
  {
    _id: new ObjectId('6072f6a7ce01a00418b97a12'),
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
    time: { startAt: 720, endAt: 1080 },
    status: 'onConfirmation',
    date: getTomorrowMoscowUTC(),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
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
    time: { startAt: 720, endAt: 1080 },
    status: 'onConfirmation',
    date: getTomorrowMoscowUTC(),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  // should not find it
  {
    _id: new ObjectId('6072f6a7ce01a11418b97a19'),
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
    time: { startAt: 720, endAt: 1080 },
    status: 'onConfirmation',
    date: getTodayMoscowUTC(),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
  {
    _id: new ObjectId('6072faa7ce01a11418b97a19'),
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
    time: { startAt: 720, endAt: 1080 },
    status: 'onConfirmation',
    date: getYesterdayMoscowUTC(),
    createdAt: new Date('2021-04-11T13:16:23.744Z'),
  },
];

module.exports = moscowBookedAppointments;
