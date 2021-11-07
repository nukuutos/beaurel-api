const { invalidParam, noParam } = require('../../../../../../config/errors/id');
const { SERVICE_ID } = require('../../../../../../config/id-names');

const serviceId = {
  name: 'serviceId',
  tests: [
    {
      message: 'should fail, invalid param',
      data: { serviceId: '12312abc' },
      error: invalidParam(SERVICE_ID),
    },
    {
      message: 'should fail, invalid param',
      data: { serviceId: null },
      error: noParam(SERVICE_ID),
    },
  ],
};

module.exports = serviceId;
