const cloneDeep = require('lodash.clonedeep');
const master = require('../../../../../data/users/master');
const master3 = require('../../../../../data/users/master-3');

const masterWithNewFriend = cloneDeep(master);
masterWithNewFriend.masters.push(master3._id);

module.exports = masterWithNewFriend;
