const { INVALID_ROOM_VALUE } = require('../../../../../../config/errors/auth');

const roomValueMoreThan32 = 'аыдолаыодлаыволдаолдолдаыводллодл';

const roomValue = {
  name: 'room.value',
  tests: [
    {
      message: 'should fail, no param',
      data: { name: '' },
      error: INVALID_ROOM_VALUE,
    },
    {
      message: 'should fail, no param',
      data: { name: null },
      error: INVALID_ROOM_VALUE,
    },
    {
      message: 'should fail, no param',
      data: { name: ' ' },
      error: INVALID_ROOM_VALUE,
    },
    {
      message: 'should fail, invalid param',
      data: { name: roomValueMoreThan32 },
      error: INVALID_ROOM_VALUE,
    },
  ],
};

module.exports = roomValue;
