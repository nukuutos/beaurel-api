const { NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  if (NODE_ENV === 'test' || NODE_ENV === 'production') return next();

  console.log('--- REQUEST ---');
  console.log(req.method, req.url);
  next();
};
