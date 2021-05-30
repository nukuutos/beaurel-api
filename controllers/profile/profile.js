const User = require('../../models/profile/profile');
const HttpError = require('../../models/http-error');

const asyncHandler = require('../../middleware/async-handler');

const { formatImageBuffer, deleteImage, saveImageFS } = require('../../utils/image');

exports.updateProfileId = asyncHandler(async (req, res, next) => {
  const { profileId } = req.params;
  const { newId } = req.body;

  const user = User.findOne({ _id: newId }, { _id: 1 });
  if (user) return next(new HttpError('User with that id has already exists'));
  /// do batch here
  User.updateOne({ _id: profileId }, { $set: { _id: newId } });

  await User.updateOne({ _id: profileId }, { $set: { ...req.body } });

  return res.status(200).json({ message: 'Profile is updated!', type: 'success' });
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { profileId } = req.params;

  await User.updateOne({ _id: profileId }, { $set: { ...req.body } });

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