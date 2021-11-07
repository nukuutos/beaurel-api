const {
  APPOINTMENT_END_REQUIRED,
  INVALID_APPOINTMENT_END,
} = require('../../../../../../config/errors/appointment');

const endAt = {
  name: 'endAt',
  tests: [
    {
      message: 'should fail, invalid param',
      data: { endAt: null },
      error: APPOINTMENT_END_REQUIRED,
    },
    {
      message: 'should fail, invalid param',
      data: {},
      error: APPOINTMENT_END_REQUIRED,
    },
    {
      message: 'should fail, invalid field',
      data: { endAt: '' },
      error: APPOINTMENT_END_REQUIRED,
    },
    {
      message: 'should fail, invalid field',
      data: { endAt: ' 3 ' },
      error: INVALID_APPOINTMENT_END,
    },
    {
      message: 'should fail, invalid field',
      data: { endAt: -1 },
      error: INVALID_APPOINTMENT_END,
    },
    {
      message: 'should fail, invalid field',
      data: { endAt: 1441 },
      error: INVALID_APPOINTMENT_END,
    },
  ],
};

module.exports = endAt;
