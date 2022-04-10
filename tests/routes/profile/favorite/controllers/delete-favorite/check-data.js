const User = require('../../../../../../models/user');
const masterWithoutDeletedFriend = require('./master-without-deleted-friend');

const checkData = async () => {
  const masterDb = await User.findOne({ _id: masterWithoutDeletedFriend._id });
  expect(masterDb).toStrictEqual(masterWithoutDeletedFriend);
};

module.exports = checkData;
