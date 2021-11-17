const Appointment = require('../../../../models/appointment');
const ChangeStatus = require('./change-status');

class ChangeStatusByCustomer extends ChangeStatus {
  constructor({ status, id, customerId }) {
    super({ status, id });
    this.customerId = customerId;
  }

  static async getAppointment(id, customerId) {
    const appointment = await Appointment.findOne({ _id: id, customerId }, { _id: 0, status: 1 });
    return new this({ ...(appointment || {}), id, customerId });
  }

  async update(status) {
    const { id, customerId } = this;
    await Appointment.updateOne({ _id: id, customerId }, { status });
  }
}

module.exports = ChangeStatusByCustomer;
