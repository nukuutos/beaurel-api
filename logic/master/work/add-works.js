const { TITLE_EXISTS, WORKS_LIMIT } = require('../../../config/errors/work');
const HttpError = require('../../../models/utils/http-error');
const Work = require('../../../models/work');
const WorkImage = require('./work-image');

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

  isExisted() {
    const { existedWorks, title } = this;
    const isTitle = existedWorks.some(({ title: existedTitle }) => existedTitle === title);
    if (isTitle) throw new HttpError(TITLE_EXISTS, 400);
    return this;
  }

  isLimit() {
    const { existedWorks } = this;
    const isWorksLimit = existedWorks.length > WORKS_LIMIT_COUNT;
    if (isWorksLimit) throw new HttpError(WORKS_LIMIT, 400);
    return this;
  }

  async save() {
    const { existedWorks, ...work } = this;
    const { insertedId: id } = await Work.save(work);
    this._id = id;
  }

  async saveFile(buffer) {
    const { _id } = this;
    const image = new WorkImage(_id, buffer);
    await image.saveFS(onError(_id));
  }
}

module.exports = AddWork;
