const dayjs = require('dayjs');
const { APPOINTMENT } = require('../config/collection-names');

const Collection = require('./utils/collection/collection');

class Appointment extends Collection {
  static name = APPOINTMENT;

  constructor(masterId, customerId, service, time, date) {
    super();

    this.masterId = masterId;
    this.customerId = customerId;
    this.service = service;
    this.time = time; // { startAt, endAt }
    this.status = 'onConfirmation'; // onConfirmation, confirmed, cancelled, ended/expired, unsuitable, history?
    this.date = date;
    this.createdAt = dayjs().utcNow();
  }
}

module.exports = Appointment;
