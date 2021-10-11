const { SERVICE } = require("../../config/collection-names");
const Service = require("./service");

class SubService extends Service {
  static name = SERVICE;

  constructor({ parameter = null, ...subService }) {
    super({ ...subService });

    this.parameter = parameter;
  }

  async update() {
    const { id, parameter, duration, price } = this;
    await SubService.updateOne({ _id: id }, { parameter, duration, price });
  }

  setOrderAndSubOrder(order, subOrder) {
    this.order = order;
    this.subOrder = subOrder;
    return this;
  }

  setTitleAndMasterId(title, masterId) {
    this.title = title;
    this.masterId = masterId;
    return this;
  }
}

module.exports = SubService;
