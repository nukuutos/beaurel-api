const { DB_USER, DB_PASSWORD, DB_CLUSTER, DB_NAME, DB_AUTH_SOURCE } = process.env;

const getURI = () =>
  `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?authSource=${DB_AUTH_SOURCE}`;

module.exports = getURI;
