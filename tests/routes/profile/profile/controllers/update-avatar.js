const path = require('path');
const fs = require('fs');
const getImageSize = require('image-size');
const Image = require('../../../../../models/utils/image');
const { NO_IMAGE } = require('../../../../../config/errors/image');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');

const pathInvalidFile = path.rootJoin('tests', 'data', 'files', 'pdf', 'test.pdf');
const pathUploadAvatar = path.rootJoin('tests', 'data', 'files', 'images', 'avatar.jpg');

let pathFirstSavedAvatar;

module.exports = function () {
  beforeAll(async () => {
    await User.deleteMany({});
    await User.save(master);
  });

  it('should successfully update null avatar', async () => {
    const response = await this.request().attach('image', pathUploadAvatar);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { avatar } = body;

    pathFirstSavedAvatar = path.rootJoin(avatar);

    const isExist = fs.existsSync(pathFirstSavedAvatar);

    expect(isExist).toBe(true);

    const { width, height } = getImageSize(pathFirstSavedAvatar);

    const maxSize = 600;

    expect(width).toBeLessThanOrEqual(maxSize);
    expect(height).toBeLessThanOrEqual(maxSize);
  });

  it('should successfully update avatar', async () => {
    const response = await this.request().attach('image', pathUploadAvatar);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    let isExist = fs.existsSync(pathFirstSavedAvatar);

    expect(isExist).toBe(false);

    const { avatar } = body;

    const pathSecondSavedAvatar = path.rootJoin(avatar);

    isExist = fs.existsSync(pathSecondSavedAvatar);

    expect(isExist).toBe(true);

    const { width, height } = getImageSize(pathSecondSavedAvatar);

    const maxSize = 600;

    expect(width).toBeLessThanOrEqual(maxSize);
    expect(height).toBeLessThanOrEqual(maxSize);

    Image.deleteFS(pathSecondSavedAvatar);

    isExist = fs.existsSync(pathSecondSavedAvatar);

    expect(isExist).toBe(false);
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
