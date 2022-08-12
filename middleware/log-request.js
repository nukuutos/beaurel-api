const { PRODUCTION, TEST } = require('../config/environments');

const { NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  if (NODE_ENV === TEST || NODE_ENV === PRODUCTION) return next();

  console.log('--- REQUEST ---');
  console.log(req.method, req.url);
  next();
};
