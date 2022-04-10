const cloneDeep = require('lodash.clonedeep');
const { ObjectId } = require('mongodb');
const master = require('../../../data/users/master');

const moscowMaster = cloneDeep(master);
moscowMaster._id = new ObjectId('5eb149b31c2bca20386ced75');
moscowMaster.city = 'Москва';

module.exports = moscowMaster;
