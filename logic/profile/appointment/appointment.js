const { APPOINTMENT } = require('../../../config/collection-names');

const AppointmentModel = require('../../../models/appointment');

const masterAppointmentsAndCustomers = require('../../../pipelines/appointments/master-appointments-and-customers');
const customerAppointmentsAndMasters = require('../../../pipelines/appointments/customer-appointments-and-masters');

const { sortDays } = require('./utils');

class Appointment extends AppointmentModel {
  static name = APPOINTMENT;

  static async getAppointmentsAsMaster(masterId, category, page) {
    const pipeline = masterAppointmentsAndCustomers(masterId, category, page);
    const datesWithAppointments = await this.aggregate(pipeline).next();
    const sortedDatesWithAppointments = sortDays(datesWithAppointments);
    return sortedDatesWithAppointments;
  }

  static async getAppointmentsAsCustomer(customerId, category, page) {
    const pipeline = customerAppointmentsAndMasters(customerId, category, page);
    const datesWithAppointments = await this.aggregate(pipeline).next();
    const sortedDatesWithAppointments = sortDays(datesWithAppointments);
    return sortedDatesWithAppointments;
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
}

module.exports = Appointment;
