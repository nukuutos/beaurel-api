const rateLimit = require('express-rate-limit');

const isTest = process.env.NODE_ENV === 'test';

const goToNextMiddleware = (req, res, next) => next();

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});

module.exports = isTest ? goToNextMiddleware : rateLimiter;
