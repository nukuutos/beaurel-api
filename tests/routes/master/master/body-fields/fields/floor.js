const { NO_FLOOR, INVALID_FLOOR } = require('../../../../../../config/errors/auth');

const floor = {
  name: 'floor',
  tests: [
    {
      message: 'should fail, no param',
      data: { floor: '' },
      error: NO_FLOOR,
    },
    {
      message: 'should fail, no param',
      data: { floor: null },
      error: NO_FLOOR,
    },
    {
      message: 'should fail, no param',
      data: { floor: ' ' },
      error: NO_FLOOR,
    },
    {
      message: 'should fail, invalid param',
      data: { floor: 0 },
      error: INVALID_FLOOR,
    },
    {
      message: 'should fail, invalid param',
      data: { floor: 88 },
      error: INVALID_FLOOR,
    },
  ],
};

module.exports = floor;
