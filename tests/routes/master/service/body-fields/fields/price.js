const { PRICE_REQUIRED, PRICE_NUMBER } = require('../../../../../../config/errors/service');

const price = {
  name: 'price',
  tests: [
    {
      message: 'should fail, field required',
      data: { price: '' },
      error: PRICE_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: { price: null },
      error: PRICE_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: {},
      error: PRICE_REQUIRED,
    },
    {
      message: 'should fail, price less than should be',
      data: { price: -1 },
      error: PRICE_NUMBER,
    },
    {
      message: 'should fail, price more than should be',
      data: { price: 100000 },
      error: PRICE_NUMBER,
    },
  ],
};

module.exports = price;
