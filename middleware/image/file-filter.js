const fileFilter = (req, file, cb) => {
  const { mimetype } = file;
  if (mimetype === "image/png" || mimetype === "image/jpg" || mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = fileFilter;
