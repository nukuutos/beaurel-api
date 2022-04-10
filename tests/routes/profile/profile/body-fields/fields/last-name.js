const {
  INVALID_LAST_NAME_LENGTH,
  INVALID_LAST_NAME,
} = require('../../../../../../config/errors/profile');

const moreMaxLength = 'оченьинетерсноеимятао';

const lastName = {
  name: 'lastName',
  tests: [
    {
      message: 'should fail, invalid field',
      data: { lastName: 'авоfвыа_' },
      error: INVALID_LAST_NAME,
    },
    {
      message: 'should fail, more than max',
      data: { lastName: moreMaxLength },
      error: INVALID_LAST_NAME_LENGTH,
    },
    {
      message: 'should fail, less than min',
      data: { lastName: 'а' },
      error: INVALID_LAST_NAME_LENGTH,
    },
  ],
};

module.exports = lastName;
