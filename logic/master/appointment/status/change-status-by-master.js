const Appointment = require('../../../../models/appointment');
const ChangeStatus = require('./change-status');

class ChangeStatusByMaster extends ChangeStatus {
  constructor({ status, id, masterId }) {
    super({ status, id });
    this.masterId = masterId;
  }

  static async getAppointment(id, masterId) {
    const appointment = await Appointment.findOne({ _id: id, masterId }, { _id: 0, status: 1 });
    return new this({ ...(appointment || {}), id, masterId });
  }

  async update(status) {
    const { id, masterId } = this;
    await Appointment.updateOne({ _id: id, masterId }, { status });
  }
}

module.exports = ChangeStatusByMaster;
