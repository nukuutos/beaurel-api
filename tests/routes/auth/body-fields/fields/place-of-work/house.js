const { NO_HOUSE, INVALID_HOUSE } = require('../../../../../../config/errors/auth');

const houseLengthMoreThan8 = '123456789';

const house = {
  name: 'placeOfWork.house',
  tests: [
    {
      message: 'should fail, no param',
      data: { house: '' },
      error: NO_HOUSE,
    },
    {
      message: 'should fail, no param',
      data: { house: null },
      error: NO_HOUSE,
    },
    {
      message: 'should fail, no param',
      data: { house: ' ' },
      error: NO_HOUSE,
    },
    {
      message: 'should fail, invalid param',
      data: { house: houseLengthMoreThan8 },
      error: INVALID_HOUSE,
    },
  ],
};

module.exports = house;
