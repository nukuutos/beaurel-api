const { ObjectId } = require('mongodb');
const customer = require('../masters/customer');
const master = require('../masters/master');
const masters = require('../masters/masters');

module.exports = [
  {
    _id: new ObjectId('61d6e80fa1441a17380f261b'),
    senderId: customer._id,
    isUnread: true,
    recipientId: master._id,
    message: 'not last',
    createdAt: '2021-12-09T10:00:00.000Z',
  },
  {
    _id: new ObjectId('61d6e80fa1441a17380f262a'),
    senderId: master._id,
    isUnread: true,
    recipientId: customer._id,
    message: 'first',
    createdAt: '2021-12-07T00:00:00.000Z',
  },
  {
    _id: new ObjectId('61d6e80fa1441a17380f263b'),
    senderId: customer._id,
    isUnread: true,
    recipientId: master._id,
    message: 'first',
    createdAt: '2021-12-11T11:00:00.000Z',
  },
  {
    _id: new ObjectId('61d6e80ca1441a17380f2624'),
    senderId: master._id,
    isUnread: false,
    recipientId: masters[0]._id,
    message: 'first',
    createdAt: '2021-12-09T10:00:00.000Z',
  },
  {
    _id: new ObjectId('61d6e80fa1441a17380f162b'),
    senderId: masters[0]._id,
    isUnread: false,
    recipientId: master._id,
    message: 'not last',
    createdAt: '2021-12-08T00:00:00.000Z',
  },
  {
    _id: new ObjectId('61d6e80fa1441a17385f262b'),
    senderId: master._id,
    isUnread: false,
    recipientId: masters[0]._id,
    message: 'last',
    createdAt: '2021-12-06T11:00:00.000Z',
  },
];
