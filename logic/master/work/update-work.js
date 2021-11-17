const { TITLE_EXISTS } = require('../../../config/errors/work');
const HttpError = require('../../../models/utils/http-error');
const Work = require('../../../models/work');
const WorkImage = require('./work-image');

class UpdateWork extends Work {
  constructor(workId, masterId, title) {
    super(masterId, title);
    this.id = workId;
  }

  async checkTitle() {
    const { id, masterId, title } = this;
    const isTitle = await Work.findOne({ _id: { $ne: id }, masterId, title }, { _id: 1 });
    if (isTitle) throw new HttpError(TITLE_EXISTS, 400);
  }

  async updateFile(buffer) {
    const { id } = this;
    const image = new WorkImage(id, buffer);
    await image.save();
  }

  async updateTitle() {
    const { id, title } = this;
    await Work.updateOne({ _id: id }, { title });
  }
}

module.exports = UpdateWork;
