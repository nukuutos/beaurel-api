const { MongoClient } = require("mongodb");

const { DB_USER, DB_PASSWORD, DB_CLUSTER, DB_NAME } = process.env;

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

let _db;

const mongoConnect = async (callback) => {
  const options = { useUnifiedTopology: true };
  const client = new MongoClient(uri, options);

  try {
    await client.connect();
    console.log("Connected!");
    _db = client.db();
    callback();
  } catch (err) {
    console.log(err);
    client.close();
  }
};

const getDb = () => {
  if (_db) return _db;
  throw "No database found!";
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

module.exports = { mongoConnect, getDb, getCollection, getAggregate };
