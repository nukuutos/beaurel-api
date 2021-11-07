const {
  PARAMETER_REQUIRED,
  PARAMETER_LENGTH,
  INVALID_PARAMETER,
} = require('../../../../../config/errors/service');

const parameterMoreMaxLength = 'сукиываодыл';

const parameter = {
  name: 'parameter',
  tests: [
    {
      message: 'should fail, field required',
      data: { parameter: '' },
      error: PARAMETER_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: { parameter: null },
      error: PARAMETER_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: {},
      error: PARAMETER_REQUIRED,
    },
    {
      message: 'should fail, invalid length',
      data: { parameter: 'г' },
      error: PARAMETER_LENGTH,
    },
    {
      message: 'should fail, invalid length',
      data: { parameter: parameterMoreMaxLength },
      error: PARAMETER_LENGTH,
    },
    {
      message: 'should fail, field required',
      data: { parameter: '<са' },
      error: INVALID_PARAMETER,
    },
  ],
};

module.exports = parameter;
