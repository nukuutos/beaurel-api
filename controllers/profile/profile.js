const asyncHandler = require('../../middleware/async-handler');
const Profile = require('../../logic/profile/profile');

exports.updateProfile = asyncHandler(async (req, res) => {
  const { id: profileId } = req.user;

  await Profile.udpateProfile(profileId, req.body);

  return res.json({ message: 'Профиль обновлён!' });
});

exports.updateAvatar = asyncHandler(async (req, res) => {
  const { file, user } = req;

  const { buffer } = file;
  const { id } = user;

  const shortUrl = await Profile.updateAvatar(id, buffer);

  return res.json({ avatar: shortUrl, message: 'Фото профиля успешно обновлено!' });
});
