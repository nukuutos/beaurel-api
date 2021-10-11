const User = require("../../models/user/user");
const asyncHandler = require("../../middleware/async-handler");
const Avatar = require("../../models/user/avatar");

exports.updateProfile = asyncHandler(async (req, res) => {
  const { id: profileId } = req.user;

  await User.updateOne({ _id: profileId }, { ...req.body });

  return res.json({ message: "Профиль обновлён!" });
});

exports.updateAvatar = asyncHandler(async (req, res) => {
  const { file, user } = req;

  const { buffer } = file;
  const { id } = user;

  const avatar = new Avatar({ id, buffer });

  await avatar.saveFS();
  await Avatar.deletePreviousFS(id);
  await avatar.getShortUrl().updateDB(id);

  const { shortUrl } = avatar;

  return res.json({ avatar: shortUrl, message: "Фото профиля успешно обновлено!" });
});
