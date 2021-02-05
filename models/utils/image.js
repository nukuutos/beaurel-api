const sharp = require('sharp');

exports.saveImageFS = async (buffer, imageUrl) => await sharp(buffer).png({ quality: 86 }).toFile(imageUrl);
