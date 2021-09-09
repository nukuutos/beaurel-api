const { dirname } = require("path");

module.exports = () => {
  const { filename } = require.main;
  return dirname(filename);
};
