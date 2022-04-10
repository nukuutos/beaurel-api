const { VALUE_REQUIRED, INVALID_VALUE } = require('../../../../../../../config/errors/review');

const value = {
  name: 'value',
  tests: [
    {
      message: 'should fail, field required',
      data: { value: '' },
      error: VALUE_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: { value: null },
      error: VALUE_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: {},
      error: VALUE_REQUIRED,
    },
    {
      message: 'should fail, invalid value',
      data: { value: -1 },
      error: INVALID_VALUE,
    },
    {
      message: 'should fail, invalid value',
      data: { value: 'ахаха' },
      error: INVALID_VALUE,
    },
    {
      message: 'should fail, invalid value',
      data: { value: 6 },
      error: INVALID_VALUE,
    },
  ],
};

module.exports = value;
