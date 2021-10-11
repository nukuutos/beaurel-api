const multer = require("multer");
const fileFilter = require("./file-filter");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: { fieldSize: 25 * 1024 * 1024 },
}).single("image");

module.exports = upload;
