const path = require('path');
const User = require('../models/user');
const HttpError = require('../models/http-error');
const { ObjectId } = require('mongodb');

const asyncHandler = require('../middleware/async-handler');

const { sendTokenResponse } = require('./utils/auth');
const { formatImageBuffer, deleteImage } = require('./utils/image');
const { saveImageFS } = require('../models/utils/image');
const master = require('../middleware/master');
const { updateOne } = require('../models/appointment');

exports.getMasters = asyncHandler(async (req, res, next) => {
  const { specialization, name } = req.query;

  // search by query
  const query = { role: 'master' };

  if (specialization.length) query.specialization = new RegExp(`^${specialization}`, 'i');

  // search by name (add id)
  if (name.includes(' ')) {
    const [firstName, lastName] = name.split(' ').map((name) => new RegExp(`^${name}`, 'i'));
    query.$or = [
      { firstName, lastName },
      { firstName: lastName, lastName: firstName },
    ];
  } else if (name.length) {
    const regexName = new RegExp(`^${name}`, 'i');
    query.$or = [{ firstName: regexName }, { lastName: regexName }];
  }

  const data = await User.findMasters(query);

  console.log(query, data);

  return res.status(200).json({ masters: data || [] });
});

exports.getProfile = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;

  const profile = await User.getMasterProfile(masterId);
  return res.status(200).json(profile);
});

exports.updateProfileId = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;
  const { newId } = req.body;

  const user = User.findOne({ _id: newId }, { _id: 1 });
  if (user) return next(new HttpError('User with that id has already exists'));
  /// do batch here
  User.updateOne({ _id: masterId }, { $set: { _id: newId } });

  await User.updateOne({ _id: masterId }, { $set: { ...req.body } });

  return res.status(200).json({ message: 'Profile is updated!', type: 'success' });
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;

  await User.updateOne({ _id: masterId }, { $set: { ...req.body } });

  return res.status(200).json({ message: 'Profile is updated!', type: 'success' });
});

exports.updateAvatar = asyncHandler(async (req, res, next) => {
  const {
    file: { buffer },
    params: { masterId },
  } = req;

  const defaultAvatarUrl = 'images/avatars/default.png';

  const { avatar } = await User.findOne({ _id: masterId }, { _id: 0, avatar: 1 });
  const formatedBuffer = await formatImageBuffer(buffer);

  const imageName = new Date().toISOString().replace(/:/g, '-') + '-' + masterId.toString() + '.png';
  const imageUrl = 'images/' + 'avatars/' + imageName;

  if (defaultAvatarUrl !== imageUrl) deleteImage(avatar);
  await saveImageFS(formatedBuffer, imageUrl);
  await User.updateOne({ _id: masterId }, { $set: { avatar: imageUrl } });

  return res.status(200).json({ avatar: imageUrl, message: 'Avatar is updated!', type: 'success' });
});

exports.getPrivateMasters = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  // favorite + not favorite
  const data = await User.getMasters(userId);

  return res.json({ data, type: 'success' });
});

exports.getFavoriteMasters = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  // favorite + not favorite
  const data = await User.getFavoriteMasters(userId);
  console.log(data);
  return res.json({ data, type: 'success' });
});

exports.addMaster = asyncHandler(async (req, res, next) => {
  const { userId, masterId } = req.params;

  const { masters } = await User.findOne({ _id: userId }, { _id: 0, masters: 1 });

  const stringMasters = masters.map((master) => master.toString());
  const stringMasterId = masterId.toString();

  if (stringMasters.includes(stringMasterId)) {
    return next(new HttpError('This master has been already in your list', 401));
  }

  await User.updateOne({ _id: userId }, { $push: { masters: masterId } });
  return res.json({ message: 'Master is added', type: 'success' });
});

exports.deleteMaster = asyncHandler(async (req, res, next) => {
  const { userId, masterId } = req.params;
  // $in?
  await User.updateOne({ _id: userId }, { $pull: { masters: { $in: [masterId] } } });

  return res.json({ message: 'Master is deleted', type: 'success' });
});
