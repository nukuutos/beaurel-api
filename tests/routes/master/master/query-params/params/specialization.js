const {
  INVALID_SPECIALIZATION,
  NO_SPECIALIZATION,
} = require('../../../../../../config/errors/master');

const specialization = {
  name: 'specialization',
  tests: [
    {
      message: 'should fail, no param',
      data: {},
      error: NO_SPECIALIZATION,
    },
    {
      message: 'should fail, invalid param',
      data: { specialization: 'Виза' },
      error: INVALID_SPECIALIZATION,
    },
  ],
};

module.exports = specialization;
