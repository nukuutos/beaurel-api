const {
  SESSION_TIME_REQUIRED,
  SESSION_TIME_DURATION,
  TYPE_REQUIRED,
  INVALID_TYPE,
} = require('../../../../../../config/errors/timetable');

const type = {
  name: 'type',
  tests: [
    {
      message: 'should fail, field required',
      data: { type: '' },
      error: TYPE_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: { type: null },
      error: TYPE_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: {},
      error: TYPE_REQUIRED,
    },
    {
      message: 'should fail, invalid value',
      data: { type: 45 },
      error: INVALID_TYPE,
    },
    {
      message: 'should fail, invalid value',
      data: { type: 'хахах' },
      error: INVALID_TYPE,
    },
  ],
};

module.exports = type;
