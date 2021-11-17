const { TITLE_EXISTS } = require('../../../config/errors/work');
const HttpError = require('../../../models/utils/http-error');
const Work = require('../../../models/work');
const WorkImage = require('./work-image');

const onError = (_id) => async () => await Work.deleteOne({ _id });

class AddWork extends Work {
  constructor(masterId, title) {
    super(masterId, title);
  }

  async isExisted() {
    const { masterId, title } = this;
    const isTitle = await Work.findOne({ masterId, title }, { _id: 1, title: 1 });
    if (isTitle) throw new HttpError(TITLE_EXISTS, 400);
  }

  async save() {
    const { insertedId: id } = await Work.save(this);
    this._id = id;
  }

  async saveFile(buffer) {
    const { _id } = this;
    const image = new WorkImage(_id, buffer);
    await image.saveFS(onError(_id));
  }
}

module.exports = AddWork;
