const sharp = require('sharp');
const { WORKS_LIMIT, FAIL_WORK_UPLOAD } = require('../../../config/errors/work');
const HttpError = require('../../../models/utils/http-error');
const Work = require('../../../models/work');
const s3 = require('../../../utils/s3');

const onError = (_id) => async () => await Work.deleteOne({ _id });

const WORKS_LIMIT_COUNT = 18;

class AddWork extends Work {
  constructor(masterId, title) {
    super(masterId, title);
  }

  async getData() {
    const { masterId } = this;
    const works = await Work.find({ masterId }, { title: 1 });
    this.existedWorks = works;
  }

  isLimit() {
    const { existedWorks } = this;
    const isWorksLimit = existedWorks.length >= WORKS_LIMIT_COUNT;
    if (isWorksLimit) throw new HttpError(WORKS_LIMIT, 400);
    return this;
  }

  async save() {
    const { existedWorks, ...work } = this;
    const { insertedId: id } = await Work.save(work);
    this.id = id;
  }

  async saveFile(buffer) {
    const { id, masterId } = this;

    buffer = await sharp.decreaseSize(buffer);

    const filename = `${id}.webp`;
    const folder = `${masterId}`;

    const isUploaded = await s3.Upload(
      {
        buffer,
        name: filename,
      },
      folder
    );

    if (!isUploaded) {
      onError(id);
      throw new HttpError(FAIL_WORK_UPLOAD, 500);
    }
  }
}

module.exports = AddWork;
