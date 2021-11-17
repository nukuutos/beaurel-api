const { SERVICE } = require('../../../config/collection-names');
const { INCORRECT_DURATION } = require('../../../config/errors/service');
const Service = require('../../../models/service');
const HttpError = require('../../../models/utils/http-error');

class SubService extends Service {
  static name = SERVICE;

  constructor({ parameter = null, ...subService }) {
    super({ ...subService });
    this.parameter = parameter;
  }

  async update() {
    const { id, parameter, duration, price, masterId } = this;
    await SubService.updateOne({ _id: id, masterId }, { parameter, duration, price });
  }

  setOrderAndSubOrder(order, subOrder) {
    this.order = order;
    this.subOrder = subOrder;
    return this;
  }

  checkDuration(sessionTime) {
    if (this.duration % sessionTime !== 0) throw new HttpError(INCORRECT_DURATION, 400);
    return this;
  }
}

module.exports = SubService;
