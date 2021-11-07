const {
  TITLE_REQUIRED,
  TITLE_LENGTH,
  INVALID_TITLE,
} = require('../../../../../config/errors/service');

const titleMoreMaxLength = 'сукиываодылв оадывоадлоывалдо оыарвлралыврадоывдлоо';

const title = {
  name: 'title',
  tests: [
    {
      message: 'should fail, field required',
      data: { title: '' },
      error: TITLE_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: { title: null },
      error: TITLE_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: {},
      error: TITLE_REQUIRED,
    },
    {
      message: 'should fail, invalid length',
      data: { title: 'аг' },
      error: TITLE_LENGTH,
    },
    {
      message: 'should fail, invalid length',
      data: { title: titleMoreMaxLength },
      error: TITLE_LENGTH,
    },
    {
      message: 'should fail, field required',
      data: { title: '<са' },
      error: INVALID_TITLE,
    },
  ],
};

module.exports = title;
