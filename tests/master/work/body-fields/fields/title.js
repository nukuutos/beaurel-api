const { TITLE_REQUIRED, INVALID_LENGTH } = require('../../../../../config/errors/work');

const titleMoreMaxLength = 'сукиываодылв оадывоадлоывалдо оыарвлралыврадоывдлоо';

const title = {
  name: 'title',
  tests: [
    {
      message: 'should fail, invalid length',
      data: { title: 'ха ' },
      error: INVALID_LENGTH,
    },
    {
      message: 'should fail, invalid length',
      data: { title: titleMoreMaxLength },
      error: INVALID_LENGTH,
    },
    {
      message: 'should fail, field required',
      data: { title: '' },
      error: TITLE_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: {},
      error: TITLE_REQUIRED,
    },
  ],
};

module.exports = title;
