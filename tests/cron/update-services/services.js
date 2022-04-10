const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const master = require('../../data/users/master');

module.exports = [
  {
    _id: new ObjectId('6121fc858fce2120cc841b68'),
    masterId: master._id,
    title: 'Ываы',
    duration: 120,
    price: 23423,
    order: 0,
    subOrder: null,
    parameter: null,
    update: {
      status: 'suitable',
      duration: 90,
      date: new Date(),
    },
  },
  {
    _id: new ObjectId('6121fc858fce2120cc841b62'),
    masterId: master._id,
    title: 'Ываы',
    duration: 120,
    price: 23423,
    order: 0,
    subOrder: null,
    parameter: null,
    update: {
      status: 'suitable',
      duration: 90,
      date: dayjs().add(1, 'h').toDate(),
    },
  },
  {
    _id: new ObjectId('6121fc9f8fce2120cc841b6c'),
    masterId: master._id,
    title: 'Суцаыва',
    parameter: 'аыва',
    duration: 120,
    price: 324,
    order: 1,
    subOrder: 2,
    update: {
      status: 'unsuitable',
      duration: 90,
      date: new Date(),
    },
  },
];
