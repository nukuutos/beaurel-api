const {
  SESSION_TIME_REQUIRED,
  SESSION_TIME_DURATION,
} = require('../../../../../config/errors/timetable');

const sessionTime = {
  name: 'sessionTime',
  tests: [
    {
      message: 'should fail, field required',
      data: { sessionTime: '' },
      error: SESSION_TIME_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: { sessionTime: null },
      error: SESSION_TIME_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: {},
      error: SESSION_TIME_REQUIRED,
    },
    {
      message: 'should fail, invalid value',
      data: { sessionTime: 45 },
      error: SESSION_TIME_DURATION,
    },
    {
      message: 'should fail, invalid value',
      data: { sessionTime: 'хахах' },
      error: SESSION_TIME_DURATION,
    },
  ],
};

module.exports = sessionTime;
