const { invalidParam, noParam } = require('../../../../../../config/errors/id');
const { SERVICE_ID } = require('../../../../../../config/id-names');

const serviceId = {
  name: 'id',
  tests: [
    {
      message: 'should fail, invalid param',
      data: { id: '12312abc' },
      error: invalidParam(SERVICE_ID),
    },
    {
      message: 'should fail, invalid param',
      data: { id: null },
      error: noParam(SERVICE_ID),
    },
  ],
};

module.exports = serviceId;
