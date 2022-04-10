const cloneDeep = require('lodash.clonedeep');
const { master } = require('../data-to-db');

const masterAfterAttempt = cloneDeep(master);
masterAfterAttempt.confirmation.attemptsCountLeft = 4;

module.exports = masterAfterAttempt;
