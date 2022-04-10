const cloneDeep = require('lodash.clonedeep');
const master = require('../../../../data/users/master');

const masterWithExpiredCode = cloneDeep(master);
masterWithExpiredCode.confirmation.lastSendAt = new Date('12-15-2021');

module.exports = { masterWithExpiredCode, master };
