const Favorite = require('../../models/profile/favorite/favorite');
const HttpError = require('../../models/http-error');

const asyncHandler = require('../../middleware/async-handler');

exports.getFavorites = asyncHandler(async (req, res, next) => {
  const { profileId } = req.params;
  // favorite + not favorite
  const data = await Favorite.getFavoriteMasters(profileId);
  console.log(data);
  return res.json({ data, type: 'success' });
});

exports.addFavorite = asyncHandler(async (req, res, next) => {
  const { profileId, masterId } = req.params;

  const { masters } = await Favorite.findOne({ _id: profileId }, { _id: 0, masters: 1 });

  const stringMasters = masters.map((master) => master.toString());
  const stringMasterId = masterId.toString();

  if (stringMasters.includes(stringMasterId)) {
    return next(new HttpError('This master has been already in your list', 401));
  }

  await Favorite.updateOne({ _id: profileId }, { $push: { masters: masterId } });
  return res.json({ message: 'Master is added', type: 'success' });
});

exports.deleteFavorite = asyncHandler(async (req, res, next) => {
  const { profileId, masterId } = req.params;
  // $in?
  await Favorite.updateOne({ _id: profileId }, { $pull: { masters: { $in: [masterId] } } });

  return res.json({ message: 'Master is deleted', type: 'success' });
});
