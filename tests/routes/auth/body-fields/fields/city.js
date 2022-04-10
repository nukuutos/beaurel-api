const { NO_CITY, INVALID_CITY } = require('../../../../../config/errors/auth');

const city = {
  name: 'city',
  tests: [
    {
      message: 'should fail, no param',
      data: { city: '' },
      error: NO_CITY,
    },
    {
      message: 'should fail, no param',
      data: { city: null },
      error: NO_CITY,
    },
    {
      message: 'should fail, no param',
      data: { city: ' ' },
      error: INVALID_CITY,
    },
    {
      message: 'should fail, invalid param',
      data: { city: 'Владиво' },
      error: INVALID_CITY,
    },
  ],
};

module.exports = city;
