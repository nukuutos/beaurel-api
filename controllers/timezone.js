const asyncHandler = require("../middleware/async-handler");
const Timezone = require("../models/timezone");

exports.getTimezone = asyncHandler(async (req, res) => {
  const { lat: userLat, lng: userLng } = req.query;

  const { city, timezone } = Timezone.getNearestCity(userLat, userLng);

  return res.json({ city, timezone });
});

exports.getTimezoneByQuery = asyncHandler(async (req, res) => {
  const { city, page } = req.query;

  const cities = await Timezone.getByCity(city, page);

  return res.json({ cities });
});
