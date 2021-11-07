const path = require("path");

path.getRootDir = function () {
  return process.env.PWD;
};

path.rootJoin = function (...rest) {
  const rootDir = this.getRootDir();
  const path = this.join(rootDir, ...rest);
  return path;
};
