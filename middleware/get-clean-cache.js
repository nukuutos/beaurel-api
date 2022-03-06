const { getRedisClient } = require('../utils/redis');

const {
  PROFILE_ID,
  MASTER_ID,
  SEARCH_TIMEZONE,
  SEARCH_MASTERS,
  FAVORITES,
  getFavoritesCacheName,
  BOOKED_APPOINTMENTS,
  getBookedAppointmentsCacheName,
} = require('../config/cache');

const handleFirstKey = (keys, req) => {
  const firstKey = keys[0];
  const userId = req.params[firstKey];
  const stringUserId = userId.toString();
  const userIdCacheKey = `id-${stringUserId}`;

  if (keys[1] === FAVORITES) {
    return getFavoritesCacheName(stringUserId);
  }

  if (keys[1] === BOOKED_APPOINTMENTS) {
    return getBookedAppointmentsCacheName(stringUserId);
  }

  return userIdCacheKey;
};

const handleKeys = (keys, req) => {
  const firstKey = keys[0];

  switch (firstKey) {
    case PROFILE_ID:
    case MASTER_ID: {
      const firstCacheKey = handleFirstKey(keys, req);
      return [firstCacheKey, keys[1]];
    }

    case SEARCH_TIMEZONE: {
      const { page: secondKey } = req.params;
      return [firstKey, secondKey];
    }

    case SEARCH_MASTERS: {
      const { city, specialization, page } = req.params;
      const secondKey = city + specialization + page;
      return [firstKey, secondKey];
    }

    default:
      return keys;
  }
};

const getCleanCache =
  (...keys) =>
  async (req, res, next) => {
    await next();

    keys = handleKeys(keys, req);

    const client = getRedisClient();

    const isKeyDeletion = [FAVORITES, BOOKED_APPOINTMENTS].includes(keys[1]);

    if (isKeyDeletion) client.del(keys[0]);
    else client.hdel(...keys);
  };

module.exports = getCleanCache;
