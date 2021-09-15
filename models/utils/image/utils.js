const { dirname, join } = require("path");

const getRootDir = () => {
  const { filename } = require.main;
  return dirname(filename);
};

const rootJoin = (...rest) => {
  const rootDir = getRootDir();
  const path = join(rootDir, ...rest);
  return path;
};

exports.getShortUrl = (url) => {
  const splittedUrl = url.split("\\");
  const startIndex = splittedUrl.indexOf("images");
  const shortUrl = splittedUrl.slice(startIndex).join("/");

  console.log(shortUrl);

  return shortUrl;
};

exports.createName = (id, withDate = false) => {
  let imageName = id + ".png";

  if (withDate) {
    const date = new Date().toISOString().replace(/:/g, "-");
    imageName = date + "-" + imageName;
  }

  return imageName;
};

exports.createUrl = (name, subfolder) => {
  const url = rootJoin("images", subfolder, name);
  return url;
};

exports.getFullUrl = (shortUrl) => {
  const url = rootJoin(shortUrl);
  return url;
};
