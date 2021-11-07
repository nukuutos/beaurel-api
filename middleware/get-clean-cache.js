const { getRedisClient } = require("../utils/redis");

const {
  MASTER_APPOINTMENTS,
  CUSTOMER_APPOINTMENTS,
  PROFILE_ID,
  MASTER_ID,
  SEARCH_TIMEZONE,
  SEARCH_MASTERS,
} = require("../config/cache");

const handleSecondKey = (key, req) => {
  const isAppointments =
    key === MASTER_APPOINTMENTS || key === CUSTOMER_APPOINTMENTS;

  if (isAppointments) {
    return key + req.params.status;
  }

  return key;
};

const handleKeys = (keys, req) => {
  const firstKey = keys[0];

  switch (firstKey) {
    case PROFILE_ID:
    case MASTER_ID: {
      const userId = req.params[firstKey];
      const stringUserId = "id-" + userId.toString();
      const secondKey = handleSecondKey(keys[1], req);
      return [stringUserId, secondKey];
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

const getCleanCache = (...keys) => {
  return async (req, res, next) => {
    await next();

    keys = handleKeys(keys, req);

    const client = getRedisClient();

    client.hdel(...keys);
  };
};

module.exports = getCleanCache;
