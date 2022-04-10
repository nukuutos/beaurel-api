const cloneDeep = require('lodash.clonedeep');
const { confirmedMaster } = require('../data-to-db');

const masterAfterAttempts = cloneDeep(confirmedMaster);
delete masterAfterAttempts.password;

module.exports = masterAfterAttempts;
