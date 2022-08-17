const s3 = require('../../utils/s3');

const cleanUpBucket = async () => {
  const list = await s3.GetList();
  const { CommonPrefixes } = list;
  const folders = CommonPrefixes.map(({ Prefix }) => Prefix);

  let fileLists = [];

  for (const folder of folders) {
    const promise = s3.GetList(folder);
    fileLists.push(promise);
  }

  fileLists = await Promise.all(fileLists);

  const filesToDelete = [];

  for (const fileList of fileLists) {
    const { Contents } = fileList;

    for (const file of Contents) {
      const promise = s3.Remove(file.Key);
      filesToDelete.push(promise);
    }
  }

  await Promise.all(filesToDelete);
};

module.exports = cleanUpBucket;
