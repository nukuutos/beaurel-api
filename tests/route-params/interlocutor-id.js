const { invalidParam } = require('../../config/errors/id');
const { INTERLOCUTOR_ID } = require('../../config/id-names');

const interlocutorId = {
  name: 'interlocutorId',
  tests: [
    {
      message: 'should fail, invalid profile id',
      data: { interlocutorId: '12312abc' },
      error: invalidParam(INTERLOCUTOR_ID),
    },
    {
      message: 'should fail, invalid profile id',
      data: { interlocutorId: 'null' },
      error: invalidParam(INTERLOCUTOR_ID),
    },
  ],
};

module.exports = interlocutorId;
