const {
  START_DAY_TIME_REQUIRED,
  INVALID_START_DAY_TIME,
} = require('../../../../../config/errors/timetable');

const startAt = {
  name: 'startAt',
  tests: [
    {
      message: 'should fail, invalid param',
      data: { startAt: null },
      error: START_DAY_TIME_REQUIRED,
    },
    {
      message: 'should fail, invalid param',
      data: {},
      error: START_DAY_TIME_REQUIRED,
    },
    {
      message: 'should fail, invalid field',
      data: { startAt: '' },
      error: START_DAY_TIME_REQUIRED,
    },
    {
      message: 'should fail, invalid field',
      data: { startAt: ' 3 ' },
      error: INVALID_START_DAY_TIME,
    },
    {
      message: 'should fail, invalid field',
      data: { startAt: -1 },
      error: INVALID_START_DAY_TIME,
    },
    {
      message: 'should fail, invalid field',
      data: { startAt: 1441 },
      error: INVALID_START_DAY_TIME,
    },
  ],
};

module.exports = startAt;
