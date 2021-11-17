const ServiceModel = require('../../../models/service');

class DeleteService {
  constructor(id, masterId) {
    this.id = id;
    this.masterId = masterId;
  }

  async delete() {
    const { id, masterId } = this;
    await ServiceModel.deleteOne({ _id: id, masterId });
  }
}

module.exports = DeleteService;
