const { invalidParam } = require('../../config/errors/id');
const { SUB_SERVICE_ID } = require('../../config/id-names');

const subServiceId = {
  name: 'subServiceId',
  tests: [
    {
      message: 'should fail, invalid param',
      data: { subServiceId: '123fsdj' },
      error: invalidParam(SUB_SERVICE_ID),
    },
    {
      message: 'should fail, invalid param',
      data: { subServiceId: 'null' },
      error: invalidParam(SUB_SERVICE_ID),
    },
  ],
};

module.exports = subServiceId;
