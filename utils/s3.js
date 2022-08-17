const EasyYandexS3 = require('easy-yandex-s3');

const { DEVELOPMENT } = require('../config/environments');

const { S3_KEY_ID, S3_ACCESS_KEY, S3_BUCKET_NAME, NODE_ENV } = process.env;

const isDebugMode = NODE_ENV === DEVELOPMENT;

const s3 = new EasyYandexS3({
  auth: {
    accessKeyId: S3_KEY_ID,
    secretAccessKey: S3_ACCESS_KEY,
  },
  Bucket: S3_BUCKET_NAME,
  debug: isDebugMode,
});

module.exports = s3;
