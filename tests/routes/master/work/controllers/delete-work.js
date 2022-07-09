const User = require('../../../../../models/user');

const Work = require('../../../../../models/work');
const s3 = require('../../../../../utils/s3');
const master = require('../../../../data/users/master');
const works = require('../data/works');
const { addImageForTest } = require('../utils');
const { getWorks, checkIsCache, checkIsCacheDeleted } = require('./utils');

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
    await Work.insertMany(works);
    await addImageForTest(works[0]._id);
  });

  it('should successfully delete work', async () => {
    await getWorks.request();
    await checkIsCache();

    const { _id } = works[0];

    const { statusCode } = await this.request();

    await checkIsCacheDeleted();

    expect(statusCode).toBe(200);

    const bucket = await s3.GetList(master._id.toString());

    expect(bucket.Contents).toHaveLength(0);

    const dbData = await Work.findOne({ _id });

    expect(dbData).toBeNull();
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
