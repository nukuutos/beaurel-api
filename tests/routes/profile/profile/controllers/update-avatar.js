const path = require('path');
const { NO_IMAGE } = require('../../../../../config/errors/image');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');
const s3 = require('../../../../../utils/s3');

const pathInvalidFile = path.rootJoin('tests', 'data', 'files', 'pdf', 'test.pdf');
const pathUploadAvatar = path.rootJoin('tests', 'data', 'files', 'images', 'avatar.jpg');

module.exports = function () {
  beforeAll(async () => {
    await User.deleteMany({});
    await User.save(master);
  });

  it('should successfully update avatar', async () => {
    const response = await this.request().attach('image', pathUploadAvatar);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const bucket = await s3.GetList(master._id.toString());

    expect(bucket.Contents).toHaveLength(1);

    const user = await User.findOne({}, { isAvatar: 1 });

    expect(user.isAvatar).toBeTruthy();
  });

  it('should filter file with invalid type', async () => {
    const response = await this.request().attach('image', pathInvalidFile);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(NO_IMAGE);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
