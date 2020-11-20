const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token;
  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // init user for null values
  req.user = {};

  // Check if no token
  if (!token) {
    req.user.id = null;
    next();
  }

  // Decode token
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY_ACCESS);
    req.user = decoded.user; // user
  } catch (error) {
    req.user.id = null;
  }

  next();
};
