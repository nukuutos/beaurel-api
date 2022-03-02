const dayjs = require('dayjs');
const { APPOINTMENT } = require('../../../config/collection-names');

const AppointmentModel = require('../../../models/appointment');

const masterAppointmentsAndCustomers = require('../../../pipelines/appointments/master-appointments-and-customers');
const customerAppointmentsAndMasters = require('../../../pipelines/appointments/customer-appointments-and-masters');

const { getFormattedAppointments } = require('./utils');

const russianTimezones = require('../../../data/timezone/russian-timezones.json');

class Appointment extends AppointmentModel {
  static name = APPOINTMENT;

  static async getAppointmentsAsMaster(masterId, category, page) {
    const findQuery = this.getFindQuery({ masterId, category });
    const pipeline = masterAppointmentsAndCustomers(findQuery, page);
    const daysWithAppointments = await this.aggregate(pipeline).toArray();
    const formattedAppointments = getFormattedAppointments(daysWithAppointments);
    return formattedAppointments;
  }

  static async getAppointmentsAsCustomer(customerId, category, page) {
    const findQuery = this.getFindQuery({ customerId, category });
    const pipeline = customerAppointmentsAndMasters(findQuery, page);
    const daysWithAppointments = await this.aggregate(pipeline).toArray();
    const formattedAppointments = getFormattedAppointments(daysWithAppointments);
    return formattedAppointments;
  }

  static getFindQuery({ category, masterId, customerId }) {
    let query = { masterId };

    if (customerId) query = { customerId };

    if (category === 'history') {
      query.$or = [
        { status: 'history' },
        { status: 'rejected' },
        { status: 'cancelled' },
        { status: 'unanswered' },
      ];
    } else {
      query.status = category;
    }

    return query;
  }

  static async setMasterAppointmentsViewed(appointments) {
    const bulkOp = AppointmentModel.unorderedBulkOp();

    let ids = [];

    for (const date in appointments) {
      const appointmentIds = [...appointments[date].map(({ _id }) => _id)];
      ids = [...ids, ...appointmentIds];
    }

    ids.forEach((_id) => {
      bulkOp.update({ _id }, { 'isViewed.master': true });
    });

    await bulkOp.execute();
  }

  static async setCustomerAppointmentsViewed(appointments) {
    const bulkOp = AppointmentModel.unorderedBulkOp();

    let ids = [];

    for (const date in appointments) {
      const appointmentIds = [...appointments[date].map(({ _id }) => _id)];
      ids = [...ids, ...appointmentIds];
    }

    ids.forEach((_id) => {
      bulkOp.update({ _id }, { 'isViewed.customer': true });
    });

    await bulkOp.execute();
  }

  static async toHistory() {
    const bulkOp = AppointmentModel.unorderedBulkOp();

    const queries = [];

    for (const timezone of russianTimezones) {
      const currentDateByTimezone = dayjs().tz(timezone);
      const todayByTimezoneInUTC = currentDateByTimezone.utc().toDate();
      const localeMinutes = currentDateByTimezone.minute() + currentDateByTimezone.hour() * 60;
      queries.push({ date: { $lte: todayByTimezoneInUTC }, 'time.endAt': { $lte: localeMinutes } });
    }

    const historyQueries = queries.map((query) => ({ ...query, status: 'confirmed' }));

    const unansweredQueries = queries.map((query) => ({
      ...query,
      $or: [{ status: 'onConfirmation' }, { status: 'unsuitable' }],
    }));

    const recordDate = dayjs().utc().toDate();

    historyQueries.forEach((findQuery) => {
      bulkOp.aggregationUpdate(findQuery, {
        $set: { status: 'history' },
        $push: { history: { user: 'server', date: recordDate, status: 'history' } },
      });
    });

    unansweredQueries.forEach((findQuery) => {
      bulkOp.aggregationUpdate(findQuery, {
        $set: { status: 'unanswered' },
        $push: { history: { user: 'server', date: recordDate, status: 'unanswered' } },
      });
    });

    console.log('Appointments to history!');

    await bulkOp.execute();
  }
}

module.exports = Appointment;
