const cloneDeep = require('lodash.clonedeep');
const { master } = require('../data-to-db');

const masterAfterAttempts = cloneDeep(master);
masterAfterAttempts.confirmation.resendCountLeft = 0;
delete masterAfterAttempts.confirmation.lastSendAt;
delete masterAfterAttempts.confirmation.verificationCode;

const unpredictableFieldsSchema = {
  properties: {
    confirmation: {
      properties: {
        lastSendAt: { type: 'object' },
        verificationCode: { type: 'string', minLength: 4, maxLength: 4 },
      },
      required: ['lastSendAt', 'verificationCode'],
    },
  },
  required: ['confirmation'],
};

module.exports = { predictableFields: masterAfterAttempts, unpredictableFieldsSchema };
