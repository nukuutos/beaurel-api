const redis = require("redis");
const util = require("util");

const client = redis.createClient();
client.hget = util.promisify(client.hget);

module.exports = client;
