const toRadians = (num) => (num * Math.PI) / 180;

exports.haversine = (startCoordinates, endCoordinates) => {
  // (start/end)Coordinates = {latitude, longitude}

  const dLatitude = toRadians(endCoordinates.latitude - startCoordinates.latitude);
  const dLongitude = toRadians(endCoordinates.longitude - startCoordinates.longitude);

  const latitudeStart = toRadians(startCoordinates.latitude);
  const latitudeEnd = toRadians(endCoordinates.latitude);

  const a =
    Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) +
    Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2) * Math.cos(latitudeStart) * Math.cos(latitudeEnd);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const R = 6371; // km

  return R * c;
};
