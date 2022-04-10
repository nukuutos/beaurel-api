const { INVALID_ROOM_VALUE } = require('../../../../../../../config/errors/auth');

const roomValueMoreThan32 = 'аыдолаыодлаыволдаолдолдаыводллодл';

const roomValue = {
  name: 'placeOfWork.room.value',
  tests: [
    {
      message: 'should fail, no param',
      data: { value: '' },
      error: INVALID_ROOM_VALUE,
    },
    {
      message: 'should fail, no param',
      data: { value: null },
      error: INVALID_ROOM_VALUE,
    },
    {
      message: 'should fail, no param',
      data: { value: ' ' },
      error: INVALID_ROOM_VALUE,
    },
    {
      message: 'should fail, invalid param',
      data: { value: roomValueMoreThan32 },
      error: INVALID_ROOM_VALUE,
    },
  ],
};

module.exports = roomValue;
