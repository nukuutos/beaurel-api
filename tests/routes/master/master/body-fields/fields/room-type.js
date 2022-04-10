const { INVALID_ROOM_TYPE } = require('../../../../../../config/errors/auth');

const roomType = {
  name: 'room.type',
  tests: [
    {
      message: 'should fail, no param',
      data: { type: '' },
      error: INVALID_ROOM_TYPE,
    },
    {
      message: 'should fail, no param',
      data: { type: null },
      error: INVALID_ROOM_TYPE,
    },
    {
      message: 'should fail, no param',
      data: { type: ' ' },
      error: INVALID_ROOM_TYPE,
    },
    {
      message: 'should fail, invalid param',
      data: { type: 'salo' },
      error: INVALID_ROOM_TYPE,
    },
  ],
};

module.exports = roomType;
