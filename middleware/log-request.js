module.exports = (req, res, next) => {
  console.log("--- REQUEST ---");
  console.log(req.method, req.url);
  next();
};
