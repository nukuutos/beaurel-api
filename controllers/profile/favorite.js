const Favorite = require("../../models/user/favorite");
const HttpError = require("../../models/utils/http-error");

const asyncHandler = require("../../middleware/async-handler");
const User = require("../../models/user/profile");

exports.getFavorites = asyncHandler(async (req, res, next) => {
  const { id: profileId } = req.user;
  const data = await Favorite.getFavoriteMasters(profileId);
  return res.json({ data, type: "success" });
});

exports.addFavorite = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;
  const { id: profileId } = req.user;

  const { masters } = await User.findOne({ _id: profileId }, { _id: 0, masters: 1 });

  const stringMasters = masters.map((master) => master.toString());
  const stringMasterId = masterId.toString();

  if (stringMasters.includes(stringMasterId)) {
    return next(new HttpError("This master has been already in your list", 401));
  }

  await User.updateOne({ _id: profileId }, { $push: { masters: masterId } });
  return res.json({ message: "Master is added", type: "success" });
});

exports.deleteFavorite = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;
  const { id: profileId } = req.user;

  // $in?
  await User.updateOne({ _id: profileId }, { $pull: { masters: { $in: [masterId] } } });

  return res.json({ message: "Master is deleted", type: "success" });
});
