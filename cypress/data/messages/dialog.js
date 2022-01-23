const { ObjectId } = require('mongodb');
const customer = require('../masters/customer');
const master = require('../masters/master');

module.exports = [
  {
    _id: new ObjectId('61d6e80fa1441a17380f261b'),
    senderId: customer._id,
    isUnread: false,
    recipientId: master._id,
    message: 'not last',
    createdAt: '2021-12-09T10:00:00.000Z',
  },
  {
    _id: new ObjectId('61d6e80fa1441a17380f262a'),
    senderId: master._id,
    isUnread: false,
    recipientId: customer._id,
    message: 'first',
    createdAt: '2021-12-07T00:00:00.000Z',
  },
  {
    _id: new ObjectId('61d6e80fa1441a17380f263b'),
    senderId: customer._id,
    isUnread: false,
    recipientId: master._id,
    message: 'not last',
    createdAt: '2021-12-11T11:00:00.000Z',
  },
  {
    _id: new ObjectId('11d6e80fa1441a17380f261b'),
    senderId: customer._id,
    isUnread: false,
    recipientId: master._id,
    message: 'not last',
    createdAt: '2021-12-09T10:00:00.000Z',
  },
  {
    _id: new ObjectId('21d6e80fa1441a17380f262a'),
    senderId: master._id,
    isUnread: false,
    recipientId: customer._id,
    message: 'not last',
    createdAt: '2021-12-08T00:00:00.000Z',
  },
  {
    _id: new ObjectId('31d6e80fa1441a17380f263b'),
    senderId: customer._id,
    isUnread: false,
    recipientId: master._id,
    message: 'not last',
    createdAt: '2021-12-11T11:00:00.000Z',
  },
  {
    _id: new ObjectId('19d6e80fa1441a17380f261b'),
    senderId: customer._id,
    isUnread: false,
    recipientId: master._id,
    message: 'not last',
    createdAt: '2021-12-09T10:00:00.000Z',
  },
  {
    _id: new ObjectId('28d6e80fa1441a17380f262a'),
    senderId: master._id,
    isUnread: false,
    recipientId: customer._id,
    message: 'not last',
    createdAt: '2021-12-08T00:00:00.000Z',
  },
  {
    _id: new ObjectId('37d6e80fa1441a17380f263b'),
    senderId: customer._id,
    isUnread: false,
    recipientId: master._id,
    message: 'not last',
    createdAt: '2021-12-11T11:00:00.000Z',
  },
  {
    _id: new ObjectId('19b6e80fa1441a17380f261b'),
    senderId: customer._id,
    isUnread: false,
    recipientId: master._id,
    message: 'not last',
    createdAt: '2021-12-09T10:00:00.000Z',
  },
  {
    _id: new ObjectId('28b6e80fa1441a17380f262a'),
    senderId: master._id,
    isUnread: false,
    recipientId: customer._id,
    message: 'not last',
    createdAt: '2021-12-08T00:00:00.000Z',
  },
  {
    _id: new ObjectId('37b6e80fa1441a17380f263b'),
    senderId: customer._id,
    isUnread: false,
    recipientId: master._id,
    message: 'not last',
    createdAt: '2021-12-11T11:00:00.000Z',
  },
  {
    _id: new ObjectId('19b6e80fa1442a17380f261b'),
    senderId: customer._id,
    isUnread: false,
    recipientId: master._id,
    message: 'not last',
    createdAt: '2021-12-09T10:00:00.000Z',
  },
  {
    _id: new ObjectId('28b6e80fa1442a17380f262a'),
    senderId: master._id,
    isUnread: false,
    recipientId: customer._id,
    message: 'not last',
    createdAt: '2021-12-08T00:00:00.000Z',
  },
  {
    _id: new ObjectId('37b6e80fa1442a17380f263b'),
    senderId: customer._id,
    isUnread: false,
    recipientId: master._id,
    message: 'not last',
    createdAt: '2021-12-11T11:00:00.000Z',
  },
  {
    _id: new ObjectId('19b6e80fa1442a17680f261b'),
    senderId: customer._id,
    isUnread: false,
    recipientId: master._id,
    message: 'not last',
    createdAt: '2021-12-09T10:00:00.000Z',
  },
  {
    _id: new ObjectId('28b6e80fa1442a17680f262a'),
    senderId: master._id,
    isUnread: false,
    recipientId: customer._id,
    message: 'not last',
    createdAt: '2021-12-08T00:00:00.000Z',
  },
  {
    _id: new ObjectId('37b6e80fa1442a17680f263b'),
    senderId: customer._id,
    isUnread: false,
    recipientId: master._id,
    message: 'not last',
    createdAt: '2021-12-11T11:00:00.000Z',
  },
  {
    _id: new ObjectId('19b6e80ca1442a17680f261b'),
    senderId: customer._id,
    isUnread: false,
    recipientId: master._id,
    message: 'last',
    createdAt: '2021-12-15T10:00:00.000Z',
  },
  {
    _id: new ObjectId('28b6e80ca1442a17680f262a'),
    senderId: master._id,
    isUnread: false,
    recipientId: customer._id,
    message: 'not last',
    createdAt: '2021-12-08T00:00:00.000Z',
  },
  {
    _id: new ObjectId('37b6e80ca1442a17680f263b'),
    senderId: customer._id,
    isUnread: false,
    recipientId: master._id,
    message: 'after loading',
    createdAt: '2021-12-04T11:00:00.000Z',
  },
];