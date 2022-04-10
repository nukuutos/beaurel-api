const { NO_NAME } = require('../../../../../../config/errors/master');

const name = {
  name: 'name',
  tests: [
    {
      message: 'should fail, no param',
      data: {},
      error: NO_NAME,
    },
  ],
};

module.exports = name;
