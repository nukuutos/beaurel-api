const cloneDeep = require('lodash.clonedeep');
const { master } = require('../data-to-db');

const confirmedMaster = cloneDeep(master);
confirmedMaster.confirmation.isConfirmed = true;

module.exports = confirmedMaster;
