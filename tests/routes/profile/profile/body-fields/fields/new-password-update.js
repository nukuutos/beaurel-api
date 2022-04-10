const {
  PASSWORD_REQUIRED,
  MIN_PASSWORD_LENGTH,
  PASSWORDS_DISMATCHED,
} = require('../../../../../../config/errors/auth');

const newPasswordUpdate = {
  name: 'newPassword',
  tests: [
    {
      message: 'should fail, empty password',
      data: { newPassword: '' },
      error: PASSWORD_REQUIRED,
    },
    {
      message: 'should fail, no field',
      data: {},
      error: PASSWORD_REQUIRED,
    },
    {
      message: 'should fail, min length',
      data: { newPassword: '1234' },
      error: MIN_PASSWORD_LENGTH,
    },
    {
      message: 'should fail, dismatched with password-confirmation',
      data: { newPassword: '12345678' },
      error: PASSWORDS_DISMATCHED,
    },
  ],
};

module.exports = newPasswordUpdate;
