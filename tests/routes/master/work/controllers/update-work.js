const fs = require('fs');
const path = require('path');

const cloneDeep = require('lodash.clonedeep');
const works = require('../data/works');
const Work = require('../../../../../models/work');
const Image = require('../../../../../models/utils/image');

const { TITLE_EXISTS, FAIL_WORK_UPDATE } = require('../../../../../config/errors/work');
const { getWorks, checkIsCache, checkIsCacheDeleted } = require('./utils');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');
const cleanUpBucket = require('../../../../utils/clean-up-bucket');
const s3 = require('../../../../../utils/s3');

const pathUploadImage = path.rootJoin('tests', 'data', 'files', 'images', 'work.jpg');
const pathInvalidFile = path.rootJoin('tests', 'data', 'files', 'pdf', 'test.pdf');
const getPathToSavedWork = (_id) => path.rootJoin('images', 'works', `${_id}.png`);

module.exports = function () {
  beforeAll(async () => {
    const worksForDb = works.slice(0, 3);
    await User.save(master);
    await Work.insertMany(worksForDb);
  });

  beforeEach(async () => await cleanUpBucket());

  it("should detect that work doesn't exist", async () => {
    await getWorks.request();
    await checkIsCache();

    const requestIncorrectWorkId = cloneDeep(this);

    requestIncorrectWorkId.routeParams.workId = '24367bed08e9f612d4080333';

    const response = await requestIncorrectWorkId
      .request()
      .field('title', 'somename')
      .attach('image', pathUploadImage);

    await checkIsCacheDeleted();

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(TITLE_EXISTS);
  });

  it('should successfully update work title', async () => {
    const newTitle = 'Новое название';

    const response = await this.request().field('title', newTitle);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const dbData = await Work.findOne({ _id: works[0]._id }, { _id: 0, title: 1 });

    expect(dbData.title).toBe(newTitle);
  });

  it('should successfully filter work image', async () => {
    const { title } = works[0];

    const response = await this.request().field('title', title).attach('image', pathInvalidFile);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const pathToWork = getPathToSavedWork(works[0]._id);

    const isExist = fs.existsSync(pathToWork);

    expect(isExist).toBeFalsy();
  });

  it('should successfully update work', async () => {
    const { title } = works[0];

    const response = await this.request().field('title', title).attach('image', pathUploadImage);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const bucket = await s3.GetList(master._id.toString());

    expect(bucket.Contents).toHaveLength(1);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
