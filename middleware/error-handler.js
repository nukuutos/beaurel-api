const { NODE_ENV } = process.env;

module.exports = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  const { message, statusCode } = error;

  if (NODE_ENV !== 'test') console.error(message, '\n', error);

  return res.status(statusCode || 500).json({
    message: message || 'Server error occured. Please try again.',
  });
};
