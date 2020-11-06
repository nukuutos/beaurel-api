module.exports = (req, res, next) => {
  // user id from params and decoded token
  const { params, user } = req;

  if (params.userId !== user.id) return next(new HttpError('Unauthorized', 401));

  next();
};
