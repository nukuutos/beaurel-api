const dayjs = require('dayjs');
const { SERVICE } = require('../../../config/collection-names');
const { INCORRECT_DURATION, NO_UPDATE_DURATION } = require('../../../config/errors/service');
const Service = require('../../../models/service');
const HttpError = require('../../../models/utils/http-error');

class SubService extends Service {
  static name = SERVICE;

  constructor({ parameter = null, ...subService }) {
    super({ ...subService });
    this.parameter = parameter;
  }

  async updateOne() {
    const { id, parameter, duration, price, masterId } = this;
    await SubService.updateOne({ _id: id, masterId }, { parameter, duration, price });
  }

  isUpdateDuration() {
    const { updateDuration } = this;

    if (updateDuration) {
      this.update = { status: 'suitable', duration: updateDuration };
    }

    return this;
  }

  setOrderAndSubOrder(order, subOrder) {
    this.order = order;
    this.subOrder = subOrder;
    return this;
  }

  checkDuration(sessionTime, timetableUpdate = null) {
    if (this.duration % sessionTime !== 0) throw new HttpError(INCORRECT_DURATION, 400);

    if (timetableUpdate) this.checkUpdateDuration(sessionTime, timetableUpdate);

    return this;
  }

  checkUpdateDuration(sessionTime, timetableUpdate) {
    if (sessionTime === timetableUpdate.sessionTime) return this;

    const { update } = this;

    if (!update) throw new HttpError(NO_UPDATE_DURATION, 400);

    if (update.duration % timetableUpdate.sessionTime !== 0) {
      throw new HttpError(INCORRECT_DURATION, 400);
    }

    this.update.date = dayjs(timetableUpdate.date).clone().toDate();

    return this;
  }
}

module.exports = SubService;
