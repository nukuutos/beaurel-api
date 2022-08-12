const EasyYandexS3 = require('easy-yandex-s3');
const HttpError = require('../models/utils/http-error');
const { INVALID_S3_BUCKET } = require('../config/errors/s3');
const {
  BUCKET_PRODUCTION,
  BUCKET_DEMO,
  BUCKET_TEST,
  BUCKET_DEVELOPMENT,
} = require('../config/s3-buckets');

const { S3_KEY_ID, S3_ACCESS_KEY, NODE_ENV } = process.env;

const getBucketName = () => {
  switch (NODE_ENV) {
    case 'production':
      return BUCKET_PRODUCTION;
    case 'demo':
      return BUCKET_DEMO;
    case 'test':
      return BUCKET_TEST;
    case 'development':
      return BUCKET_DEVELOPMENT;
    default:
      throw new HttpError(INVALID_S3_BUCKET, 500);
  }
};

const isDebugMode = NODE_ENV === 'development';
const bucketName = getBucketName();

const s3 = new EasyYandexS3({
  auth: {
    accessKeyId: S3_KEY_ID,
    secretAccessKey: S3_ACCESS_KEY,
  },
  Bucket: bucketName,
  debug: isDebugMode,
});

module.exports = s3;
