const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectID;

const HttpError = require('../models/http-error');

const asyncHandler = require('./async-handler');

module.exports = (req, res, next) => {
  let token;
  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if not token
  if (!token) return next(new HttpError('No token, authorization denied.', 401));

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY_ACCESS);
    req.user = decoded.user; // user
  } catch (error) {
    return next(new HttpError(error.message, 401));
  }

  // req.user.id = new ObjectId(req.user.id);
  // req.user.id = new ObjectId(req.user.id);

  next();
};
