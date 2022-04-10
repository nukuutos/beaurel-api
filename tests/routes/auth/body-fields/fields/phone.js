const {
  PHONE_NUMBER_REQUIRED,
  INVALID_PHONE_NUMBER,
} = require('../../../../../config/errors/auth');

const phone = {
  name: 'phone',
  tests: [
    {
      message: 'should fail, invalid identificator',
      data: { phone: 'русское' },
      error: INVALID_PHONE_NUMBER,
    },
    {
      message: 'should fail, invalid identificator',
      data: { phone: '89999999999' },
      error: INVALID_PHONE_NUMBER,
    },
    {
      message: 'should fail, invalid identificator',
      data: { phone: '+799999999999' },
      error: INVALID_PHONE_NUMBER,
    },
    {
      message: 'should fail, invalid identificator',
      data: { phone: '+7999999999' },
      error: INVALID_PHONE_NUMBER,
    },
    {
      message: 'should fail, no field',
      data: {},
      error: PHONE_NUMBER_REQUIRED,
    },
    {
      message: 'should fail, no field',
      data: { phone: '' },
      error: PHONE_NUMBER_REQUIRED,
    },
  ],
};

module.exports = phone;
