const { ORDER_NUMBER, ORDER_REQUIRED } = require('../../../../../../config/errors/service');

const order = {
  name: 'order',
  tests: [
    {
      message: 'should fail, invalid field',
      data: { order: '' },
      error: ORDER_REQUIRED,
    },
    {
      message: 'should fail, order less than should be',
      data: { order: -1 },
      error: ORDER_NUMBER,
    },
  ],
};

module.exports = order;
