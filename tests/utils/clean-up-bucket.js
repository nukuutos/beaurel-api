const s3 = require('../../utils/s3');

const cleanUpBucket = async () => {
  const list = await s3.GetList();
  const { CommonPrefixes } = list;
  const folders = CommonPrefixes.map(({ Prefix }) => Prefix);

  const paths = [];

  for (const folder of folders) {
    // eslint-disable-next-line no-await-in-loop
    const directory = await s3.GetList(folder);
    const { Contents } = directory;

    for (const file of Contents) {
      s3.Remove(file.Key);
    }
  }

  await Promise.all(paths);
};

module.exports = cleanUpBucket;
