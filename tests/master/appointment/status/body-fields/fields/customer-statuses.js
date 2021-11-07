const { STATUS_REQUIRED, INVALID_STATUS } = require('../../../../../../config/errors/appointment');

const status = {
  name: 'status',
  tests: [
    {
      message: 'should fail, field required',
      data: { status: '' },
      error: STATUS_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: { status: null },
      error: STATUS_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: {},
      error: STATUS_REQUIRED,
    },
    {
      message: 'should fail, invalid value',
      data: { status: 'rejected' },
      error: INVALID_STATUS,
    },
    {
      message: 'should fail, invalid value',
      data: { status: 'confirmed' },
      error: INVALID_STATUS,
    },
    {
      message: 'should fail, invalid value',
      data: { status: 'history' },
      error: INVALID_STATUS,
    },
  ],
};

module.exports = status;
