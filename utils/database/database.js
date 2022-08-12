const { MongoClient } = require('mongodb');
const { TEST } = require('../../config/environments');
const HttpError = require('../../models/utils/http-error');
const getURI = require('./get-uri');

const { NODE_ENV } = process.env;

const uri = getURI();

let client;

const connectDB = async () => {
  const options = { useUnifiedTopology: true };

  client = new MongoClient(uri, options);

  try {
    await client.connect();
    if (NODE_ENV !== TEST) {
      console.log('Connected!');
    }
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
