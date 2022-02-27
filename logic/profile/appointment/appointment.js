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
    const pipeline = masterAppointmentsAndCustomers(masterId, category, page);
    const daysWithAppointments = await this.aggregate(pipeline).toArray();
    const formattedAppointments = getFormattedAppointments(daysWithAppointments);
    return formattedAppointments;
  }

  static async getAppointmentsAsCustomer(customerId, category, page) {
    const pipeline = customerAppointmentsAndMasters(customerId, category, page);
    const daysWithAppointments = await this.aggregate(pipeline).toArray();
    const formattedAppointments = getFormattedAppointments(daysWithAppointments);
    return formattedAppointments;
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
      const todayByTimezoneInUTC = currentDateByTimezone.utc();
      const localeMinutes = currentDateByTimezone.minute() + currentDateByTimezone.hour() * 60;
      queries.push({ date: { $lte: todayByTimezoneInUTC }, 'time.endAt': { $lte: localeMinutes } });
    }

    queries.forEach((findQuery) => {
      bulkOp.update(findQuery, { status: 'history' });
    });

    await bulkOp.execute();
  }
}

module.exports = Appointment;
