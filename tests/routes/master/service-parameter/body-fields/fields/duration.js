const {
  DURATION_REQUIRED,
  DURATION_NUMBER,
  INVALID_DURATION,
} = require('../../../../../../config/errors/service');

const duration = {
  name: 'duration',
  tests: [
    {
      message: 'should fail, field required',
      data: { duration: '' },
      error: DURATION_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: { duration: null },
      error: DURATION_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: {},
      error: DURATION_REQUIRED,
    },
    {
      message: 'should fail, duration less than should be',
      data: { duration: 0 },
      error: DURATION_NUMBER,
    },
    {
      message: 'should fail, duration more than should be',
      data: { duration: 1441 },
      error: DURATION_NUMBER,
    },
    {
      message: 'should fail, invalid duration',
      data: { duration: 31 },
      error: INVALID_DURATION,
    },
  ],
};

module.exports = duration;
