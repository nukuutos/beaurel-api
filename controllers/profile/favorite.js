const Favorite = require("../../models/user/favorite-controller");
const asyncHandler = require("../../middleware/async-handler");

exports.getFavorites = asyncHandler(async (req, res) => {
  const { id: profileId } = req.user;

  const data = await Favorite.getFavoriteMasters(profileId);

  return res.json({ data });
});

exports.addFavorite = asyncHandler(async (req, res) => {
  const { masterId } = req.params;
  const { id: profileId } = req.user;

  const user = new Favorite(profileId);

  await user.checkMaster(masterId);
  await user.addMaster(masterId);

  return res.status(204).end();
});

exports.deleteFavorite = asyncHandler(async (req, res) => {
  const { masterId } = req.params;
  const { id: profileId } = req.user;

  const user = new Favorite(profileId);

  await user.deleteMaster(masterId);

  return res.status(204).end();
});
