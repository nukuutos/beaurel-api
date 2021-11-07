const { PARAMETERS_REQUIRED } = require('../../../../../config/errors/service');

const subServices = {
  name: 'subServices',
  tests: [
    {
      message: 'should fail, invalid field',
      data: { subServices: [] },
      error: PARAMETERS_REQUIRED,
    },
    {
      message: 'should fail, subOrder less than should be',
      data: {},
      error: PARAMETERS_REQUIRED,
    },
  ],
};

module.exports = subServices;
