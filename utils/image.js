const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

exports.formatImageBuffer = async (buffer) => {
  return await sharp(buffer)
    .metadata()
    .then(({ width, height }) => {
      const maxSize = 600;

      if (width > maxSize && width >= height) {
        return sharp(buffer).resize(maxSize).toBuffer();
      }

      if (height > maxSize && height >= width) {
        return sharp(buffer).resize(null, maxSize).toBuffer();
      }

      return buffer;
    });
};

exports.createImageName = (id) => {
  const date = new Date().toISOString().replace(/:/g, "-");
  return `${date}-${id}.png`;
};

exports.deleteImage = (imageUrl) => {
  const imagePath = path.join(__dirname, "..", imageUrl);
  // or unlink sync?
  fs.unlinkSync(imagePath, (error) => {
    if (error) throw new Error("Image is not deleted");
  });
};

exports.saveImageFS = async (buffer, imageUrl) => await sharp(buffer).png({ quality: 86 }).toFile(imageUrl);
