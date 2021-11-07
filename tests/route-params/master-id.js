const { invalidParam } = require('../../config/errors/id');
const { MASTER_ID } = require('../../config/id-names');

const masterId = {
  name: 'masterId',
  tests: [
    {
      message: 'should fail, invalid param',
      data: { masterId: '12312abc' },
      error: invalidParam(MASTER_ID),
    },
    {
      message: 'should fail, invalid param',
      data: { masterId: 'null' },
      error: invalidParam(MASTER_ID),
    },
  ],
};

module.exports = masterId;
