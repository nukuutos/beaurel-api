const { SERVICE } = require('../../../../config/collection-names');
const { TITLE_EXISTS } = require('../../../../config/errors/service');
const ServiceModel = require('../../../../models/service');
const HttpError = require('../../../../models/utils/http-error');

class UpdateServiceParameter extends ServiceModel {
  static name = SERVICE;

  constructor({ masterId, title, newTitle }) {
    super({ masterId, title });
    this.newTitle = newTitle;
  }

  async updateTitle() {
    const { title, masterId, newTitle } = this;
    await ServiceModel.updateMany({ masterId, title }, { title: newTitle });
  }

  async checkTitle() {
    const { id, masterId, newTitle } = this;

    const isTitle = await ServiceModel.findOne(
      { _id: { $ne: id || null }, masterId, title: newTitle },
      { _id: 1 }
    );

    if (isTitle) throw new HttpError(TITLE_EXISTS, 400);
  }
}

module.exports = UpdateServiceParameter;
