const path = require("path");

path.getRootDir = function () {
  const { filename } = require.main;
  return this.dirname(filename);
};

path.rootJoin = function (...rest) {
  const rootDir = this.getRootDir();
  const path = this.join(rootDir, ...rest);
  return path;
};
