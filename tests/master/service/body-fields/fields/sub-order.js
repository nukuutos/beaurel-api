const { SUBORDER_NUMBER } = require('../../../../../config/errors/service');

const subOrder = {
  name: 'subOrder',
  tests: [
    {
      message: 'should fail, invalid field',
      data: { subOrder: '' },
      error: SUBORDER_NUMBER,
    },
    {
      message: 'should fail, subOrder less than should be',
      data: { subOrder: -1 },
      error: SUBORDER_NUMBER,
    },
  ],
};

module.exports = subOrder;
