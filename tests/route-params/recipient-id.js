const { invalidParam } = require('../../config/errors/id');
const { RECIPIENT_ID } = require('../../config/id-names');

const recipientId = {
  name: 'recipientId',
  tests: [
    {
      message: 'should fail, invalid profile id',
      data: { recipientId: '12312abc' },
      error: invalidParam(RECIPIENT_ID),
    },
    {
      message: 'should fail, invalid profile id',
      data: { recipientId: 'null' },
      error: invalidParam(RECIPIENT_ID),
    },
  ],
};

module.exports = recipientId;
