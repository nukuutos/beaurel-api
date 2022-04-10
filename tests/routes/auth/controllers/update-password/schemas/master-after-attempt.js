const cloneDeep = require('lodash.clonedeep');
const { confirmedMaster } = require('../data-to-db');

const masterAfterAttempts = cloneDeep(confirmedMaster);
masterAfterAttempts.resetPassword.attemptsCountLeft = 4;
delete masterAfterAttempts.password;

module.exports = masterAfterAttempts;
