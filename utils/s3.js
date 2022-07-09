const EasyYandexS3 = require('easy-yandex-s3');

const { S3_KEY_ID, S3_ACCESS_KEY, NODE_ENV } = process.env;

const getBucketName = () => {
  switch (NODE_ENV) {
    case 'development':
      return 'beaurel-dev';
    case 'test':
      return 'beaurel-test';
    case 'production':
      return 'beaurel';
    default:
      return 'invalid-bucket-name';
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
