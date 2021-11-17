const ServiceModel = require('../../../../models/service');

class DeleteSubService {
  constructor({ masterId, _id }) {
    this._id = _id;
    this.masterId = masterId;
  }

  async delete() {
    const { _id, masterId } = this;
    await ServiceModel.deleteOne({ _id, masterId });
  }
}

module.exports = DeleteSubService;
