const customer = require('../masters/customer');
const master = require('../masters/master');

module.exports = {
  senderId: master._id,
  isUnread: true,
  recipientId: customer._id,
  message: 'not last',
  createdAt: '2021-12-09T10:00:00.000Z',
};
