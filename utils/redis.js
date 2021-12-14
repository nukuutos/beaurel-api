const redis = require('redis');
const util = require('util');
const HttpError = require('../models/utils/http-error');

let client;

const connectRedis = () => {
  client = redis.createClient();
  client.hget = util.promisify(client.hget);
};

const closeRedis = () => {
  client.quit();
};

const getRedisClient = () => {
  if (client) return client;
  throw new HttpError('No Redis Client found!');
};

const dropRedis = () => {
  if (client) return client.flushall();
  throw new HttpError('No Redis Client found!');
};

const getCachedData = async (...args) => {
  if (client) return await client.hget(...args);
  throw new HttpError('No Redis Client found!');
};

module.exports = { connectRedis, getCachedData, dropRedis, closeRedis, getRedisClient };
