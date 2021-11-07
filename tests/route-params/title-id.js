const {
  TITLE_REQUIRED,
  INVALID_TITLE_ID,
  TITLE_ID_LENGTH,
} = require('../../config/errors/service');

const titleMoreMaxLength = 'сукиываодылв оадывоадлоывалдо оыарвлралыврадоывдлоо';

const titleId = {
  name: 'titleId',
  tests: [
    {
      message: 'should fail, field required',
      data: { titleId: ' ' },
      error: TITLE_REQUIRED,
    },
    {
      message: 'should fail, invalid field',
      data: { titleId: 'null' },
      error: INVALID_TITLE_ID,
    },
    {
      message: 'should fail, invalid length',
      data: { titleId: 'аг' },
      error: TITLE_ID_LENGTH,
    },
    {
      message: 'should fail, invalid length',
      data: { titleId: titleMoreMaxLength },
      error: TITLE_ID_LENGTH,
    },
    {
      message: 'should fail, invalid field',
      data: { titleId: '<са' },
      error: INVALID_TITLE_ID,
    },
  ],
};

module.exports = titleId;
