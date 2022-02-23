const { TITLE_REQUIRED, TITLE_ID_LENGTH } = require('../../config/errors/service');

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
      message: 'should fail, invalid length',
      data: { titleId: 'аг' },
      error: TITLE_ID_LENGTH,
    },
    {
      message: 'should fail, invalid length',
      data: { titleId: titleMoreMaxLength },
      error: TITLE_ID_LENGTH,
    },
  ],
};

module.exports = titleId;
