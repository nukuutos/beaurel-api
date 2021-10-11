const Collection = require("../utils/collection/collection");
const { WORK } = require("../../config/collection-names");
const HttpError = require("../utils/http-error");
const { TITLE_EXISTS } = require("../../config/errors/work");

class Work extends Collection {
  static name = WORK;

  constructor(masterId, title) {
    super();

    this.masterId = masterId;
    this.title = title;
  }

  static async isExisted(masterId, title) {
    const isTitle = await this.findOne({ masterId, title }, { _id: 1 });
    if (isTitle) throw new HttpError(TITLE_EXISTS, 400);
  }

  static async deleteDB(id) {
    await Work.deleteOne({ _id: id });
  }

  setId(id) {
    this.id = id;
    return this;
  }

  async checkTitle() {
    const { id, masterId, title } = this;
    const isTitle = await Work.findOne({ _id: { $ne: id }, masterId, title }, { _id: 1 });
    if (isTitle) throw new HttpError(TITLE_EXISTS, 400);
  }

  async updateTitle() {
    const { id, title } = this;
    await Work.updateOne({ _id: id }, { title });
  }
}

module.exports = Work;
