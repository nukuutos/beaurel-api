const { ORDER_REQUIRED, ORDER_NUMBER } = require('../../../../../config/errors/service');

const order = {
  name: 'order',
  tests: [
    {
      message: 'should fail, field required',
      data: { order: null },
      error: ORDER_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: {},
      error: ORDER_REQUIRED,
    },
    {
      message: 'should fail, invalid field',
      data: { order: '' },
      error: ORDER_NUMBER,
    },
    {
      message: 'should fail, order less than should be',
      data: { order: -1 },
      error: ORDER_NUMBER,
    },
  ],
};

module.exports = order;
