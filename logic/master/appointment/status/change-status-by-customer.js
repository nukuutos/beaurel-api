const Appointment = require('../../../../models/appointment');
const ChangeStatus = require('./change-status');

class ChangeStatusByCustomer extends ChangeStatus {
  constructor(appointment) {
    super(appointment);
  }

  static async getAppointment(id, customerId) {
    const appointment = await Appointment.findOne(
      { _id: id, customerId },
      { createdAt: 0, _id: 0 }
    );

    return new this({ ...(appointment || {}), id, customerId });
  }

  setIsViewed() {
    const { masterId, customerId } = this;

    this.isViewed = { master: false, customer: true };

    if (masterId.toString() === customerId.toString()) {
      this.isViewed.master = true;
    }

    return this;
  }

  async update(status) {
    const { id, isViewed } = this;
    await Appointment.updateOne({ _id: id }, { isViewed, status });
  }
}

module.exports = ChangeStatusByCustomer;
