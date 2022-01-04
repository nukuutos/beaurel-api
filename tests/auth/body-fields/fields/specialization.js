const { NO_SPECIALIZATION, INVALID_SPECIALIZATION } = require('../../../../config/errors/master');

const specialization = {
  name: 'specialization',
  tests: [
    {
      message: 'should fail, no param',
      data: { specialization: '' },
      error: NO_SPECIALIZATION,
    },
    {
      message: 'should fail, no param',
      data: { specialization: ' ' },
      error: INVALID_SPECIALIZATION,
    },
    {
      message: 'should fail, no param',
      data: { specialization: null },
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
