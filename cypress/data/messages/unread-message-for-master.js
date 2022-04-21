const customer = require('../masters/customer');
const master = require('../masters/master');

module.exports = {
  senderId: customer._id,
  isUnread: true,
  recipientId: master._id,
  message: 'not last',
  createdAt: '2021-12-09T10:00:00.000Z',
};
