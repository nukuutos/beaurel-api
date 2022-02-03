const { ROLE_REQUIRED, INVALID_ROLE } = require('../../../../../../config/errors/appointment');

const role = {
  name: 'role',
  tests: [
    {
      message: 'should fail, field required',
      data: { role: '' },
      error: ROLE_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: { role: null },
      error: ROLE_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: {},
      error: ROLE_REQUIRED,
    },
    {
      message: 'should fail, invalid role',
      data: { role: 'abcd' },
      error: INVALID_ROLE,
    },
  ],
};

module.exports = role;
