const {
  END_DAY_TIME_REQUIRED,
  INVALID_END_DAY_TIME,
  START_TIME_OVER_END_TIME,
} = require('../../../../../../config/errors/timetable');

const endAt = {
  name: 'auto.workingDay.endAt',
  tests: [
    {
      message: 'should fail, invalid param',
      data: { endAt: null },
      error: END_DAY_TIME_REQUIRED,
    },
    {
      message: 'should fail, invalid param',
      data: {},
      error: END_DAY_TIME_REQUIRED,
    },
    {
      message: 'should fail, invalid field',
      data: { endAt: '' },
      error: END_DAY_TIME_REQUIRED,
    },
    {
      message: 'should fail, invalid field',
      data: { endAt: ' 3 ' },
      error: INVALID_END_DAY_TIME,
    },
    {
      message: 'should fail, invalid field',
      data: { endAt: -1 },
      error: INVALID_END_DAY_TIME,
    },
    {
      message: 'should fail, invalid field',
      data: { endAt: 10 },
      error: START_TIME_OVER_END_TIME,
    },
  ],
};

module.exports = endAt;
