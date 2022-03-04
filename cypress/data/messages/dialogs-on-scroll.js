const master = require('../masters/master');
const masters = require('../masters/masters');

const createData = () => {
  const data = []; // length is 22

  for (const sender of masters) {
    data.push({
      senderId: sender._id,
      isUnread: false,
      recipientId: master._id,
      message: 'not last',
      createdAt: '2021-12-09T10:00:00.000Z',
    });
  }

  return data;
};

module.exports = createData();
