const User = require('../../../../../../models/user');
const masterWithNewFriend = require('./master-with-new-friend');

const checkData = async () => {
  const masterDb = await User.findOne({ _id: masterWithNewFriend._id });
  expect(masterDb).toStrictEqual(masterWithNewFriend);
};

module.exports = checkData;
