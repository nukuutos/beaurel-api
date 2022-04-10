const { ObjectId } = require('mongodb');
const master = require('../../../../../data/users/master');
const master1 = require('../../../../../data/users/master-1');

module.exports = {
  _id: new ObjectId('61acd03c847544f1f4ed78e1'),
  masterId: master._id,
  customerId: master1._id,
  service: {
    title: 'УслугаДляОбновления',
    duration: 90,
    price: 2132,
    order: null,
    subOrder: null,
    parameter: null,
  },
  time: { startAt: 540, endAt: 630 },
  isViewed: { master: false, customer: false },
  createdAt: '2021-12-05T14:44:12.406Z',
  status: 'unsuitable',
  date: new Date('2021-12-08T00:00:00.000Z'),
};
