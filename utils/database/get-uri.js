const { PRODUCTION } = require('../../config/environments');

const { DB_USER, DB_PASSWORD, DB_CLUSTER, DB_NAME, DB_AUTH_SOURCE, DB_REPLICA_SET, NODE_ENV } =
  process.env;

const getURI = () => {
  if (NODE_ENV === PRODUCTION) {
    return `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}`;
  }

  return `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?authSource=${DB_AUTH_SOURCE}&replicaSet=${DB_REPLICA_SET}`;
};

module.exports = getURI;
