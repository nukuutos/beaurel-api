const { CHANGE_STATUS } = require('../../../../config/errors/appointment');
const { NO_APPOINTMENT } = require('../../../../config/errors/review');
const HttpError = require('../../../../models/utils/http-error');

class ChangeStatus {
  constructor({ status, id, masterId, customerId, isViewed, service, time, date }) {
    this.status = status;
    this.id = id;
    this.masterId = masterId;
    this.customerId = customerId;
    this.isViewed = isViewed;
    this.service = service;
    this.time = time;
    this.date = date;
  }

  isExisted() {
    if (!this.status) throw new HttpError(NO_APPOINTMENT, 404);
    return this;
  }

  checkImmutableStatuses() {
    const { status } = this;

    const immutableStatuses = ['rejected', 'history', 'cancelled'];

    if (immutableStatuses.includes(status)) throw new HttpError(CHANGE_STATUS, 400);

    return this;
  }
}

module.exports = ChangeStatus;
