const { connectDB, closeDB, dropCollection, getDb } = require('../../utils/database');
const { connectReddis, closeRedis, dropRedis } = require('../../utils/redis');

const { TIMEZONE } = require('../../config/collection-names');

const dropCollections = async () => {
  const db = getDb();
  // cant filter collections with $ operators (?)
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();
  const filteredCollections = collections.filter((collection) => collection.name !== TIMEZONE);

  const promises = [];

  for (const { name } of filteredCollections) {
    promises.push(dropCollection(name));
  }

  await Promise.all(promises);
};

const before = (cb) =>
  beforeAll(async () => {
    connectReddis();
    dropRedis();

    await connectDB();
    await dropCollections();

    if (cb) await cb();
  });

const after = (cb) =>
  afterAll(async () => {
    if (cb) await cb();

    dropRedis();
    closeRedis();

    await dropCollections();
    await closeDB();
  });

module.exports = { before, after };
