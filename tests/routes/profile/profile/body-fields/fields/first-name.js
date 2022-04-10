const {
  INVALID_FIRST_NAME_LENGTH,
  INVALID_FIRST_NAME,
} = require('../../../../../../config/errors/profile');

const moreMaxLength = 'оченьинетерсноеимятао';

const firstName = {
  name: 'firstName',
  tests: [
    {
      message: 'should fail, invalid field',
      data: { firstName: 'авоfвыа_' },
      error: INVALID_FIRST_NAME,
    },
    {
      message: 'should fail, more than max',
      data: { firstName: moreMaxLength },
      error: INVALID_FIRST_NAME_LENGTH,
    },
    {
      message: 'should fail, less than min',
      data: { firstName: 'а' },
      error: INVALID_FIRST_NAME_LENGTH,
    },
  ],
};

module.exports = firstName;
