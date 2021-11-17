const fs = require('fs');
const path = require('path');

const works = require('../../../data/works');
const Work = require('../../../../models/work');
const Image = require('../../../../models/utils/image');

const { TITLE_EXISTS } = require('../../../../config/errors/work');
const { getWorks, checkIsCache, checkIsCacheDeleted } = require('./utils');

const pathUploadImage = path.rootJoin('tests', 'data', 'files', 'images', 'work.jpg');
const pathInvalidFile = path.rootJoin('tests', 'data', 'files', 'pdf', 'test.pdf');
const getPathToSavedWork = (_id) => path.rootJoin('images', 'works', `${_id}.png`);

module.exports = function () {
  it('should detect work with title that already existed', async () => {
    await getWorks.request();
    await checkIsCache();

    const { title } = works[1];

    const response = await this.request().field('title', title).attach('image', pathUploadImage);

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

    const pathToWork = getPathToSavedWork(works[0]._id);

    let isExist = fs.existsSync(pathToWork);

    expect(isExist).toBeTruthy();

    Image.deleteFS(pathToWork);

    isExist = fs.existsSync(pathToWork);

    expect(isExist).toBe(false);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
