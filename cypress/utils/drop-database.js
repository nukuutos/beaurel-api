const { TIMEZONE } = require('../../config/collection-names');
const { getDb, dropCollection } = require('../../utils/database');

const dropDatabase = async () => {
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

module.exports = dropDatabase;
