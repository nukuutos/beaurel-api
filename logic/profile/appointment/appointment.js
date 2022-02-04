const { APPOINTMENT } = require('../../../config/collection-names');

const AppointmentModel = require('../../../models/appointment');

const masterAppointmentsAndCustomers = require('../../../pipelines/appointments/master-appointments-and-customers');
const customerAppointmentsAndMasters = require('../../../pipelines/appointments/customer-appointments-and-masters');

const { sortDays } = require('./utils');

class Appointment extends AppointmentModel {
  static name = APPOINTMENT;

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

  static async setMasterAppointmentsViewed(masterId, category) {
    await AppointmentModel.updateMany({ masterId, status: category }, { 'isViewed.master': true });
  }

  static async setCustomerAppointmentsViewed(customerId, category) {
    await AppointmentModel.updateMany(
      { customerId, status: category },
      { 'isViewed.customer': true }
    );
  }
}

module.exports = Appointment;
