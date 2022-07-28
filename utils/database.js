const { MongoClient } = require('mongodb');
const HttpError = require('../models/utils/http-error');

const { DB_USER, DB_PASSWORD, DB_CLUSTER, DB_NAME, NODE_ENV, DB_AUTH_SOURCE, DB_REPLICA_SET } =
  process.env;

const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?authSource=${DB_AUTH_SOURCE}&replicaSet=${DB_REPLICA_SET}`;

let client;

const connectDB = async () => {
  const options = { useUnifiedTopology: true };

  client = new MongoClient(uri, options);

  try {
    await client.connect();
    if (NODE_ENV !== 'test') console.log('Connected!');
  } catch (err) {
    console.log(err);
    client.close();
  }

  return client;
};

const closeDB = () => {
  client.close();
};

const getDb = () => {
  if (client) return client.db();
  throw new HttpError('No database found!');
};

const dropDB = async () => {
  const db = getDb();
  await db.dropDatabase();
};

const dropCollection = async (name) => {
  const db = getDb();
  await db.dropCollection(name);
};

const getCollection = (name) => {
  const db = getDb();
  return db.collection(name);
};

const getAggregate = (collectionName) => {
  const collection = getCollection(collectionName);
  const aggregate = collection.aggregate.bind(collection);

  return aggregate;
};

module.exports = { connectDB, dropCollection, dropDB, closeDB, getDb, getCollection, getAggregate };
