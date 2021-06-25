const asyncHandler = require('../../middleware/async-handler');
const citiesData = require('./json/short-data.json');
const { haversine } = require('./utils');
const Timezone = require('../../models/timezone');

exports.getTimezone = asyncHandler(async (req, res, next) => {
  const { lat: currentLat, lng: currentLng } = req.query;

  // find min distance between user location and available cities

  let [minValue, index] = [Infinity, -1];

  citiesData.forEach((city, currentIndex) => {
    const { latitude, longitude } = city;
    const value = haversine({ latitude: currentLat, longitude: currentLng }, { latitude, longitude });
    if (value < minValue) [minValue, index] = [value, currentIndex];
  });

  const { city, timezone } = citiesData[index];

  return res.json({ city, timezone });
});

exports.getTimezoneByCity = asyncHandler(async (req, res, next) => {
  const { city, page } = req.query;

  const regexCity = new RegExp(`^${city}`, 'i');

  const cities = await Timezone.find(regexCity, page);

  return res.status(200).json({ cities });
});
