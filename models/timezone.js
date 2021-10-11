const { TIMEZONE } = require("../config/collection-names");
const Collection = require("./utils/collection/collection");
const citiesData = require("../data/timezone/short-data.json");

class Timezone extends Collection {
  static name = TIMEZONE;

  static async getByCity(city, page) {
    const regexCity = new RegExp(`^${city}`, "i");

    const cities = await Timezone.find({ city: regexCity }, { _id: 0 }, { page, limit: 10 });

    return cities;
  }

  static getNearestCity(userLatitude, userLongitude) {
    let [minValue, index] = [Infinity, -1];

    citiesData.forEach((city, currentIndex) => {
      const { latitude, longitude } = city;

      const value = Timezone.haversine(
        { latitude: userLatitude, longitude: userLongitude },
        { latitude, longitude }
      );

      if (value < minValue) [minValue, index] = [value, currentIndex];
    });

    const { city, timezone } = citiesData[index];

    return { city, timezone };
  }

  static haversine(startCoordinates, endCoordinates) {
    // (start/end)Coordinates = {latitude, longitude}
    const toRadians = (num) => (num * Math.PI) / 180;

    const dLatitude = toRadians(endCoordinates.latitude - startCoordinates.latitude);
    const dLongitude = toRadians(endCoordinates.longitude - startCoordinates.longitude);

    const latitudeStart = toRadians(startCoordinates.latitude);
    const latitudeEnd = toRadians(endCoordinates.latitude);

    const a =
      Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) +
      Math.sin(dLongitude / 2) *
        Math.sin(dLongitude / 2) *
        Math.cos(latitudeStart) *
        Math.cos(latitudeEnd);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const R = 6371; // km

    return R * c;
  }
}

module.exports = Timezone;
