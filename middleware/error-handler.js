module.exports = (error, req, res, next) => {
  // if res has already sent
  if (res.headerSent) return next(error);

  const { message, statusCode } = error;

  console.error(message, "\n", error);

  res
    .status(statusCode || 500)
    .json({ message: message || "Server error occured. Please try again." });
};
