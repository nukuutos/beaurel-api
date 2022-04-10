const { MAX_BUILDING_LENGTH } = require('../../../../../../config/errors/auth');

const buildingLengthMoreThan6 = '1234567';

const building = {
  name: 'building',
  tests: [
    {
      message: 'should fail, invalid param',
      data: { building: buildingLengthMoreThan6 },
      error: MAX_BUILDING_LENGTH,
    },
  ],
};

module.exports = building;
