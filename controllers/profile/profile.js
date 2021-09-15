const User = require("../../models/user/profile");
const HttpError = require("../../models/utils/http-error");

const asyncHandler = require("../../middleware/async-handler");

const Image = require("../../models/utils/image/image");

const { getShortUrl, getFullUrl } = require("../../models/utils/image/utils");

// exports.updateProfileId = asyncHandler(async (req, res, next) => {
//   const { profileId } = req.params;
//   const { newId } = req.body;

//   const user = User.findOne({ _id: newId }, { _id: 1 });
//   if (user) return next(new HttpError('User with that id has already exists'));
//   /// do batch here
//   User.updateOne({ _id: profileId }, { $set: { _id: newId } });

//   await User.updateOne({ _id: profileId }, { $set: { ...req.body } });

//   return res.status(200).json({ message: 'Profile is updated!', type: 'success' });
// });

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { id: profileId } = req.user;

  await User.updateOne({ _id: profileId }, { $set: { ...req.body } });

  return res.status(200).json({ message: "Profile is updated!", type: "success" });
});

exports.updateAvatar = asyncHandler(async (req, res, next) => {
  const {
    file: { buffer },
    user: { id: profileId },
  } = req;

  const { avatar } = await User.findOne({ _id: profileId }, { _id: 0, avatar: 1 });

  const image = new Image({ buffer, id: profileId, subfolder: "avatars" }, { withDate: true });
  await image.save();
  const shortUrl = getShortUrl(image.url);
  await User.updateOne({ _id: profileId }, { avatar: shortUrl });

  if (avatar) {
    const imageToDelete = getFullUrl(avatar);
    Image.deleteByUrl(imageToDelete);
  }

  return res.status(200).json({ avatar: shortUrl, message: "Avatar is updated!", type: "success" });
});
