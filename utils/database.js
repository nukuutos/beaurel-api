const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

let _db;
const mongoConnect = async (callback) => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
    console.log('Connected!');
    _db = client.db();
    callback();
  } catch (err) {
    console.log(err);
    process.exit(1); // Exit process with failure
  }
};

const getDb = () => {
  if (_db) return _db;
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
