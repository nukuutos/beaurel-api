const {
  LAST_NAME_REQUIRED,
  ALPHABATIC_LAST_NAME,
  MIN_LAST_NAME_LENGTH,
} = require('../../../../config/errors/auth');

const lastName = {
  name: 'lastName',
  tests: [
    {
      message: 'should fail, empty field',
      data: { lastName: '' },
      error: LAST_NAME_REQUIRED,
    },
    {
      message: 'should fail, no field',
      data: {},
      error: LAST_NAME_REQUIRED,
    },
    {
      message: 'should fail, in english',
      data: { lastName: 'Test' },
      error: ALPHABATIC_LAST_NAME,
    },
    {
      message: 'should fail, with special characters',
      data: { lastName: 'Тес*т' },
      error: ALPHABATIC_LAST_NAME,
    },
    {
      message: 'should fail, with whitespace',
      data: { lastName: 'Тес т' },
      error: ALPHABATIC_LAST_NAME,
    },
    {
      message: 'should fail, with whitespace',
      data: { lastName: 'Т' },
      error: MIN_LAST_NAME_LENGTH,
    },
  ],
};

module.exports = lastName;
