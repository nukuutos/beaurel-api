const fs = require('fs');
const path = require('path');

const Work = require('../../../../models/work');
const works = require('../../../data/works');
const { getWorks, checkIsCache, checkIsCacheDeleted } = require('./utils');

const getPathToSavedWork = (_id) => path.rootJoin('images', 'works', `${_id}.png`);

module.exports = function () {
  it('should successfully delete work', async () => {
    await getWorks.request();
    await checkIsCache();

    const { _id } = works[0];

    const { statusCode } = await this.request();

    await checkIsCacheDeleted();

    expect(statusCode).toBe(200);

    const pathToWork = getPathToSavedWork(_id);

    const isFileExist = fs.existsSync(pathToWork);

    expect(isFileExist).toBeFalsy();

    const dbData = await Work.findOne({ _id });

    expect(dbData).toBeNull();
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
