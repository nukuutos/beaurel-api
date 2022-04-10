const { confirmedMaster } = require('./data-to-db');

const validData = {
  phone: '+79999999999',
  code: confirmedMaster.resetPassword.verificationCode,
  newPassword: '1234567',
  newConfirmedPassword: '1234567',
};

const dataWithInvalidPhone = { ...validData, phone: '+79999999989' };

const dataWithInvalidVerificationCode = { ...validData, code: 'CCCC' };

module.exports = { validData, dataWithInvalidPhone, dataWithInvalidVerificationCode };
