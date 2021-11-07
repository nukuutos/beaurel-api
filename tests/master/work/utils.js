const path = require('path');
const fs = require('fs');
const Image = require('../../../models/utils/image');

const addImageForTest = async (_id) => {
  const pathUploadImage = path.rootJoin('tests', 'data', 'files', 'images', 'work.jpg');
  const buffer = fs.readFileSync(pathUploadImage);
  const imagePath = path.rootJoin('images', 'works', `${_id}.png`);
  const image = new Image(buffer);
  image.url = imagePath;
  await image.saveFS();
};

const cleanUpImage = (_id) => {
  const imagePath = path.rootJoin('images', 'works', `${_id}.png`);
  const isFileExist = fs.existsSync(imagePath);
  if (isFileExist) Image.deleteFS(imagePath);
};

module.exports = { addImageForTest, cleanUpImage };
