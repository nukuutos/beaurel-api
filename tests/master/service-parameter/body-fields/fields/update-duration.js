const { DURATION_NUMBER, INVALID_DURATION } = require('../../../../../config/errors/service');

const updateDuration = {
  name: 'updateDuration',
  tests: [
    {
      message: 'should fail, duration less than should be',
      data: { updateDuration: 0 },
      error: DURATION_NUMBER,
    },
    {
      message: 'should fail, duration more than should be',
      data: { updateDuration: 1441 },
      error: DURATION_NUMBER,
    },
    {
      message: 'should fail, invalid duration',
      data: { updateDuration: 31 },
      error: INVALID_DURATION,
    },
  ],
};

module.exports = updateDuration;
