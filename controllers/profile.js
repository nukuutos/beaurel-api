const User = require('../models/user');
const HttpError = require('../models/http-error');

const asyncHandler = require('../middleware/async-handler');

const { sendTokenResponse } = require('./utils/auth');

exports.getProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const profile = await User.getMasterProfile(userId);
  return res.status(200).json(profile);
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  await User.updateOne({ _id: userId }, { ...req.body });
  return res.status(200).json({ message: 'Profile is updated!', type: 'success' });
});

// exports.upgradeMaster = asyncHandler(async (req, res, next) => {
//   const { id, role } = req.user;

//   if (role === 'master') return next(new HttpError('You have been master'), 400);

//   await User.updateOne({ _id: id }, { ...req.body });

//   sendTokenResponse({ _id: id, role }, res);
// });

// exports.starMaster = asyncHandler(async (req, res, next) => {
//   const userId = req.user.id;
//   const { masterId } = req.params;

//   await User.updateOne({ _id: userId }, { $push: { staredMaster: masterId } });
//   return res.json('Master is stared');
// });

// exports.unstarMaster = asyncHandler(async (req, res, next) => {
//   const userId = req.user.id;
//   const { masterId } = req.params;

//   await User.updateOne({ _id: userId }, { $pull: { staredMaster: { $eq: masterId } } });
//   return res.json('Master is stared');
// });
