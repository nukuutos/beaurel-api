const { invalidParam } = require('../../config/errors/id');
const { APPOINTMENT_ID } = require('../../config/id-names');

const appointmentId = {
  name: 'appointmentId',
  tests: [
    {
      message: 'should fail, invalid param',
      data: { appointmentId: `12312abc` },
      error: invalidParam(APPOINTMENT_ID),
    },
    {
      message: 'should fail, invalid param',
      data: { appointmentId: 'null' },
      error: invalidParam(APPOINTMENT_ID),
    },
  ],
};

module.exports = appointmentId;
