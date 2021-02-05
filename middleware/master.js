const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  // const { role } = req.user; // it can not be destructure if no role

  if (!req.user || req.user.role !== 'master') return next(new HttpError('Authorization denied.', 401));

  next();
};
