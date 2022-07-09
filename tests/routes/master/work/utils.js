const path = require('path');
const fs = require('fs');
const Image = require('../../../../models/utils/image');
const s3 = require('../../../../utils/s3');
const master = require('../../../data/users/master');

const addImageForTest = async (_id) => {
  const pathUploadImage = path.rootJoin('tests', 'data', 'files', 'images', 'work.jpg');
  const buffer = fs.readFileSync(pathUploadImage);
  await s3.Upload({ buffer, name: `${_id}.webp` }, master._id.toString());
};

const cleanUpImage = (_id) => {
  const imagePath = path.rootJoin('images', 'works', `${_id}.webp`);
  const isFileExist = fs.existsSync(imagePath);
  if (isFileExist) Image.deleteFS(imagePath);
};

module.exports = { addImageForTest, cleanUpImage };
