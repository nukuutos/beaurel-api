const { ObjectId } = require('mongodb');
const master = require('../masters/master');

module.exports = {
  _id: new ObjectId('61acd03c847544f1f4ed78e1'),
  masterId: master._id,
  customerId: master._id,
  service: {
    title: 'УслугаДляОбновления',
    duration: 90,
    price: 2132,
    order: null,
    subOrder: null,
    parameter: null,
  },
  history: [
    { status: 'onConfirmation', user: 'customer', date: new Date('2021-04-18T00:00:00Z') },
    { status: 'unsuitable', user: 'server', date: new Date('2021-04-18T00:00:00Z') },
  ],
  time: { startAt: 540, endAt: 630 },
  createdAt: '2021-12-05T14:44:12.406Z',
  status: 'unsuitable',
  date: new Date('2021-12-08T00:00:00.000Z'),
};
