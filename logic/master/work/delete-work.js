const HttpError = require('../../../models/utils/http-error');
const Work = require('../../../models/work');
const s3 = require('../../../utils/s3');

class DeleteWork {
  constructor(workId, masterId) {
    this.id = workId;
    this.masterId = masterId;
  }

  async delete() {
    const { id, masterId } = this;

    const filename = `${id}.webp`;
    const folder = `${masterId}`;
    const pathToFile = `${folder}/${filename}`;

    const isDeleted = await s3.Remove(pathToFile);

    if (!isDeleted) throw new HttpError('Проблемы с удалением файла!', 500);

    await Work.deleteOne({ _id: id });
  }
}

module.exports = DeleteWork;
