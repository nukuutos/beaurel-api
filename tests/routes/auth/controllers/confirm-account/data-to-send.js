const master = require('../../../../data/users/master');

const validData = {
  phone: master.phone,
  code: master.confirmation.verificationCode,
};

const dataWithInvalidPhone = {
  ...validData,
  phone: '+79999999989',
};

const dataWithInvalidCode = {
  ...validData,
  code: 'CCCC',
};

module.exports = {
  validData,
  dataWithInvalidCode,
  dataWithInvalidPhone,
};
