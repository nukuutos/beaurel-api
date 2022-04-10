const cloneDeep = require('lodash.clonedeep');
const master = require('../../../../data/users/master');

const confirmedMaster = cloneDeep(master);
confirmedMaster.confirmation.isConfirmed = true;

const masterWithExpiredCode = cloneDeep(confirmedMaster);
masterWithExpiredCode.resetPassword.lastSendAt = new Date('12-15-2021');

module.exports = { confirmedMaster, masterWithExpiredCode };
