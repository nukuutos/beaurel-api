const asyncHandler = require('../../middleware/async-handler');
const Profile = require('../../logic/profile/profile');
const GetCityAndTimezone = require('../../logic/profile/get-city-and-timezone');
const UpdatePassword = require('../../logic/profile/update-password');

exports.updateOnlineStatus = asyncHandler((req, res) => {
  const { id: profileId } = req.user;

  Profile.updateOnlineStatus(profileId);

  return res.end();
});

exports.getOnlineStatus = asyncHandler(async (req, res) => {
  const { profileId } = req.params;

  const data = await Profile.getOnlineStatus(profileId);

  return res.json(data);
});

exports.getCustomerProfile = asyncHandler(async (req, res) => {
  const { profileId } = req.params;

  const data = await Profile.getCustomerProfile(profileId);

  return res.json(data);
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { id: profileId } = req.user;

  await Profile.updateProfile(profileId, req.body);

  return res.json({ message: 'Профиль обновлён!' });
});

exports.updateUsername = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const { id: profileId } = req.user;

  await Profile.updateUsername(profileId, username);

  return res.json({ message: 'Профиль обновлён!' });
});

exports.updateAvatar = asyncHandler(async (req, res) => {
  const { file, user } = req;

  const { buffer } = file;
  const { id } = user;

  const shortUrl = await Profile.updateAvatar(id, buffer);

  return res.json({ avatar: shortUrl, message: 'Фото профиля успешно обновлено!' });
});

exports.getCityAndTimezone = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const user = new GetCityAndTimezone(userId);

  await user.getCity();

  const { city, timezone } = user.getTimezone();

  return res.json({ city, timezone });
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  const { password, newPassword } = req.body;

  const user = await UpdatePassword.getUser(profileId);

  await user.isExisted().checkCurrentPassword(password).hashNewPassword(newPassword).update();

  return res.end();
});
