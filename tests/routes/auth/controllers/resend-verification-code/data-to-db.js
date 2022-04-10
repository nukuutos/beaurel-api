const cloneDeep = require('lodash.clonedeep');
const master = require('../../../../data/users/master');

const confirmedMaster = cloneDeep(master);
confirmedMaster.confirmation.isConfirmed = true;

module.exports = { confirmedMaster, master };
