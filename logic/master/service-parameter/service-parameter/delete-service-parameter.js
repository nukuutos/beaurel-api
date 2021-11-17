const { SERVICE } = require('../../../../config/collection-names');
const ServiceModel = require('../../../../models/service');

class DeleteServiceParameter {
  static name = SERVICE;

  constructor({ masterId, title }) {
    this.title = title;
    this.masterId = masterId;
  }

  async delete() {
    const { title, masterId } = this;
    await ServiceModel.deleteMany({ title, masterId });
  }
}

module.exports = DeleteServiceParameter;
