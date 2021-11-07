const { WEEKENDS_REQUIRED, INVALID_WEEKENDS } = require('../../../../../config/errors/timetable');

const weekends = {
  name: 'weekends',
  tests: [
    {
      message: 'should fail, field required',
      data: { weekends: '' },
      error: WEEKENDS_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: { weekends: null },
      error: WEEKENDS_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: {},
      error: WEEKENDS_REQUIRED,
    },
    {
      message: 'should fail, invalid value',
      data: { weekends: 45 },
      error: INVALID_WEEKENDS,
    },
    {
      message: 'should fail, invalid value',
      data: { weekends: 'хахах' },
      error: INVALID_WEEKENDS,
    },
    {
      message: 'should fail, invalid value',
      data: { weekends: {} },
      error: INVALID_WEEKENDS,
    },
    {
      message: 'should fail, invalid length(max 6)',
      data: { weekends: [0, 1, 2, 3, 4, 5, 6, 6] },
      error: INVALID_WEEKENDS,
    },
    //
    {
      message: 'should fail, invalid value',
      data: { weekends: [-1] },
      error: INVALID_WEEKENDS,
    },
    {
      message: 'should fail, invalid value',
      data: { weekends: [7] },
      error: INVALID_WEEKENDS,
    },
    {
      message: 'should fail, invalid value',
      data: { weekends: ['hah'] },
      error: INVALID_WEEKENDS,
    },
  ],
};

module.exports = weekends;
