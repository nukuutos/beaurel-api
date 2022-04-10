const { INVALID_VERIFICATION_CODE } = require('../../../../../config/errors/auth');

const code = {
  name: 'code',
  tests: [
    {
      message: 'should fail, empty field',
      data: { code: '' },
      error: INVALID_VERIFICATION_CODE,
    },
    {
      message: 'should fail, no field',
      data: {},
      error: INVALID_VERIFICATION_CODE,
    },
    {
      message: 'should fail, in russian',
      data: { code: 'Тест' },
      error: INVALID_VERIFICATION_CODE,
    },
    {
      message: 'should fail, with special characters',
      data: { code: 'Те*т' },
      error: INVALID_VERIFICATION_CODE,
    },
    {
      message: 'should fail, with whitespace',
      data: { code: 'Тес т' },
      error: INVALID_VERIFICATION_CODE,
    },
    {
      message: 'should fail, invalid length',
      data: { code: 'Tes' },
      error: INVALID_VERIFICATION_CODE,
    },
    {
      message: 'should fail, invalid length',
      data: { code: 'Testj' },
      error: INVALID_VERIFICATION_CODE,
    },
  ],
};

module.exports = code;
