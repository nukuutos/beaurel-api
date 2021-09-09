const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

let _db;
const mongoConnect = async (callback) => {
  try {
    const client = await MongoClient.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected!");
    _db = client.db();
    callback();
  } catch (err) {
    console.log(err);
    process.exit(1); // Exit process with failure
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

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;

module.exports = { mongoConnect, getDb, getCollection, getAggregate };
