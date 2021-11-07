const dayjs = require('dayjs');
const { getAggregate } = require('../../utils/database');
const { APPOINTMENT, TIMETABLE } = require('../../config/collection-names');

const masterAppointmentsAndCustomers = require('../../pipelines/appointments/master-appointments-and-customers');
const customerAppointmentsAndMasters = require('../../pipelines/appointments/customer-appointments-and-masters');
const bookingData = require('../../pipelines/appointments/booking-data');
const Collection = require('../utils/collection/collection');
const sortDays = require('./utils/sort-days');
const handleChanges = require('./utils/handle-changes');
const HttpError = require('../utils/http-error');
const { INCORRECT_TIMETABLE } = require('../../config/errors/appointment');

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

  static async getAppointmentsAsMaster(masterId, category) {
    const pipeline = masterAppointmentsAndCustomers(masterId, category);
    const datesWithAppointments = await this.aggregate(pipeline).next();
    const sortedDatesWithAppointments = sortDays(datesWithAppointments);
    return sortedDatesWithAppointments;
  }

  static async getAppointmentsAsCustomer(customerId, category) {
    const pipeline = customerAppointmentsAndMasters(customerId, category);
    const datesWithAppointments = await this.aggregate(pipeline).next();
    const sortedDatesWithAppointments = sortDays(datesWithAppointments);
    return sortedDatesWithAppointments;
  }

  static async toConfirmed(masterId, date) {
    const query = { masterId, date: { $gte: date } };
    const update = { status: 'confirmed' };
    await this.updateMany(query, update);
  }

  static async toUnsuitable({ masterId, date, updatedTimetable, changes }) {
    const bulkOp = this.unorderedBulkOp();
    const defaultParams = { bulkOp, masterId, date };
    handleChanges(defaultParams, changes, updatedTimetable);
    await bulkOp.execute();
  }

  static async getInfoForBookingAppointment(masterId, serviceId, date) {
    const aggregate = getAggregate(TIMETABLE);
    const pipeline = bookingData(masterId, serviceId, date);
    const data = await aggregate(pipeline).next();
    if (!data) throw new HttpError(INCORRECT_TIMETABLE, 404);
    return data;
  }

  static async toOnConfirmation(masterId) {
    await this.updateMany({ masterId, status: 'unsuitable' }, { status: 'onConfirmation' });
  }
}

module.exports = Appointment;
