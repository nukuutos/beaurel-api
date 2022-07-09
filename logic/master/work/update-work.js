const sharp = require('sharp');
const { TITLE_EXISTS, FAIL_WORK_UPDATE } = require('../../../config/errors/work');
const HttpError = require('../../../models/utils/http-error');
const Work = require('../../../models/work');
const s3 = require('../../../utils/s3');

class UpdateWork extends Work {
  constructor(workId, masterId, title) {
    super(masterId, title);
    this.id = workId;
  }

  async isExisted() {
    const { id, masterId } = this;
    const isExisted = await Work.findOne({ _id: id, masterId }, { _id: 1 });
    if (!isExisted) throw new HttpError(TITLE_EXISTS, 400);
  }

  async updateTitle() {
    const { id, title } = this;
    await Work.updateOne({ _id: id }, { title });
  }

  async updateFile(buffer) {
    const { id, masterId } = this;

    buffer = await sharp.decreaseSize(buffer);

    const filename = `${id}.webp`;
    const folder = `${masterId}`;

    const isUpdated = await s3.Upload(
      {
        buffer,
        name: filename,
      },
      folder
    );

    if (!isUpdated) {
      throw new HttpError(FAIL_WORK_UPDATE, 500);
    }
  }
}

module.exports = UpdateWork;
