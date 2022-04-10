const {
  APPOINTMENT_START_REQUIRED,
  INVALID_APPOINTMENT_START,
} = require('../../../../../../../config/errors/appointment');

const startAt = {
  name: 'time.startAt',
  tests: [
    {
      message: 'should fail, invalid param',
      data: { startAt: null },
      error: APPOINTMENT_START_REQUIRED,
    },
    {
      message: 'should fail, invalid param',
      data: {},
      error: APPOINTMENT_START_REQUIRED,
    },
    {
      message: 'should fail, invalid field',
      data: { startAt: '' },
      error: APPOINTMENT_START_REQUIRED,
    },
    {
      message: 'should fail, invalid field',
      data: { startAt: ' 3 ' },
      error: INVALID_APPOINTMENT_START,
    },
    {
      message: 'should fail, invalid field',
      data: { startAt: -1 },
      error: INVALID_APPOINTMENT_START,
    },
    {
      message: 'should fail, invalid field',
      data: { startAt: 1441 },
      error: INVALID_APPOINTMENT_START,
    },
  ],
};

module.exports = startAt;
