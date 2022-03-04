const { getRedisClient } = require('../utils/redis');

const {
  PROFILE_ID,
  MASTER_ID,
  SEARCH_TIMEZONE,
  SEARCH_MASTERS,
  FAVORITES,
  getFavoritesCacheName,
} = require('../config/cache');

const handleKeys = (keys, req) => {
  const firstKey = keys[0];

  switch (firstKey) {
    case PROFILE_ID:
    case MASTER_ID: {
      const userId = req.params[firstKey];
      const stringUserId = `id-${userId.toString()}`;
      if (keys[1] !== FAVORITES) return [stringUserId, keys[1]];
      return [getFavoritesCacheName(userId.toString()), keys[1]];
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

    if (keys[1] !== FAVORITES) client.hdel(...keys);
    else client.del(keys[0]);
  };

module.exports = getCleanCache;
