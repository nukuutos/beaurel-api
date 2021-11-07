const { invalidParam } = require('../../config/errors/id');
const { TIMETABLE_ID } = require('../../config/id-names');

const timetableId = {
  name: 'timetableId',
  tests: [
    {
      message: 'should fail, invalid param',
      data: { timetableId: '12312abc' },
      error: invalidParam(TIMETABLE_ID),
    },
    {
      message: 'should fail, invalid param',
      data: { timetableId: 'null' },
      error: invalidParam(TIMETABLE_ID),
    },
  ],
};

module.exports = timetableId;
