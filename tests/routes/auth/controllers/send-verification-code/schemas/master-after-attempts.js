const cloneDeep = require('lodash.clonedeep');
const { confirmedMaster } = require('../data-to-db');

const masterAfterAttempts = cloneDeep(confirmedMaster);
masterAfterAttempts.resetPassword.resendCountLeft = 0;
delete masterAfterAttempts.resetPassword.lastSendAt;
delete masterAfterAttempts.resetPassword.verificationCode;

const unpredictableFieldsSchema = {
  properties: {
    resetPassword: {
      properties: {
        lastSendAt: { type: 'object' },
        verificationCode: { type: 'string', minLength: 4, maxLength: 4 },
      },
      required: ['lastSendAt', 'verificationCode'],
    },
  },
  required: ['resetPassword'],
};

module.exports = { predictableFields: masterAfterAttempts, unpredictableFieldsSchema };
