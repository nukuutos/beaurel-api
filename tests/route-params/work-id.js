const { invalidParam } = require('../../config/errors/id');
const { WORK_ID } = require('../../config/id-names');

const workId = {
  name: 'workId',
  tests: [
    {
      message: 'should fail, invalid param',
      data: { workId: '12312abc' },
      error: invalidParam(WORK_ID),
    },
    {
      message: 'should fail, invalid param',
      data: { workId: 'null' },
      error: invalidParam(WORK_ID),
    },
  ],
};

module.exports = workId;
