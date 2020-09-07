const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  const { role } = req.user;

  if (role !== 'master') return next(new HttpError('Authorization denied.', 401));

  next();
};
