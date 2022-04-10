const cloneDeep = require('lodash.clonedeep');
const master = require('../../../../../data/users/master');
const master2 = require('../../../../../data/users/master-2');

const masterWithoutDeletedFriend = cloneDeep(master);
masterWithoutDeletedFriend.masters = masterWithoutDeletedFriend.masters.filter(
  (masterId) => masterId.toString() !== master2._id.toString()
);

module.exports = masterWithoutDeletedFriend;
