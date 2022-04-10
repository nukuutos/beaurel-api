const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');

const works = require('../data/works');
const Image = require('../../../../../models/utils/image');

const { TITLE_EXISTS, WORKS_LIMIT } = require('../../../../../config/errors/work');
const { NO_IMAGE } = require('../../../../../config/errors/image');
const { getWorks, checkIsCache, checkIsCacheDeleted } = require('./utils');
const Work = require('../../../../../models/work');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');

const pathUploadImage = path.rootJoin('tests', 'data', 'files', 'images', 'work.jpg');
const pathInvalidFile = path.rootJoin('tests', 'data', 'files', 'pdf', 'test.pdf');

const getPathToSavedWork = (_id) => path.rootJoin('images', 'works', `${_id}.png`);

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
  });

  beforeEach(async () => {
    await Work.deleteMany({});
  });

  it('should successfully add work', async () => {
    await getWorks.request();
    await checkIsCache();

    const response = await this.request()
      .field('title', 'Крутая работа')
      .attach('image', pathUploadImage);

    await checkIsCacheDeleted();

    const { statusCode, body } = response;

    expect(statusCode).toBe(201);

    const { _id } = body;

    expect(ObjectId.isValid(_id)).toBeTruthy();

    const pathToWork = getPathToSavedWork(_id);
    // clean up
    Image.deleteFS(pathToWork);

    const isExist = fs.existsSync(pathToWork);

    expect(isExist).toBe(false);
  });

  it('should detect work with same title', async () => {
    const worksForDb = works.slice(0, 3);
    await Work.insertMany(worksForDb);

    const { title } = works[0];

    const response = await this.request().field('title', title).attach('image', pathUploadImage);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(TITLE_EXISTS);
  });

  it('should fail, master works limit', async () => {
    await Work.insertMany(works);

    const response = await this.request()
      .field('title', 'ываодывод')
      .attach('image', pathUploadImage);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(WORKS_LIMIT);
  });

  it('should detect work without file', async () => {
    const { title } = works[0];

    const response = await this.request().field('title', title);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(NO_IMAGE);
  });

  it('should filter file with invalid type', async () => {
    const { title } = works[0];

    const response = await this.request().field('title', title).attach('image', pathInvalidFile);

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
