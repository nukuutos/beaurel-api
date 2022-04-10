const { INVALID_CITY } = require('../../../../../../config/errors/timezone');

const city = {
  name: 'city',
  tests: [
    {
      message: 'should fail, no param',
      data: {},
      error: INVALID_CITY,
    },
  ],
};

module.exports = city;
