const { INVALID_CATEGORY } = require('../../../../../../config/errors/appointment');

const category = {
  name: 'category',
  tests: [
    {
      message: 'should fail, no param',
      data: {},
      error: INVALID_CATEGORY,
    },
    {
      message: 'should fail, empty param',
      data: { status: '' },
      error: INVALID_CATEGORY,
    },
    {
      message: 'should fail, invalid param',
      data: { status: 'something' },
      error: INVALID_CATEGORY,
    },
  ],
};

module.exports = category;
