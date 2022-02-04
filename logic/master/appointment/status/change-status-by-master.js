const { CHANGE_APPOINTMENT_STATUS_SOCKET } = require('../../../../config/socket-io/types');
const Appointment = require('../../../../models/appointment');
const User = require('../../../../models/user');
const { getIO } = require('../../../../utils/socket');
const ChangeStatus = require('./change-status');

const { IS_SOCKET_IO } = process.env;

class ChangeStatusByMaster extends ChangeStatus {
  constructor(appointment) {
    super(appointment);
  }

  static async getAppointment(id, masterId) {
    const appointment = await Appointment.findOne({ _id: id, masterId }, { createdAt: 0, _id: 0 });
    return new this({ ...(appointment || {}), id, masterId });
  }

  setIsViewed() {
    const { masterId, customerId } = this;

    this.isViewed = { master: true, customer: false };

    if (masterId.toString() === customerId.toString()) {
      this.isViewed.customer = true;
    }

    return this;
  }

  async update(status) {
    const { id, isViewed } = this;
    await Appointment.updateOne({ _id: id }, { isViewed, status });
  }

  async sendUpdatedAppointmentToClient(nextStatus) {
    if (!IS_SOCKET_IO) return this;

    if (!['onConfirmation', 'confirmed', 'unsuitable'].includes(nextStatus)) return this;

    const { customerId, masterId } = this;

    const stringMasterId = masterId.toString();
    const stringCustomerId = customerId.toString();

    if (stringMasterId === stringCustomerId) return this;

    const user = await User.findOne(
      { _id: masterId },
      { role: 1, username: 1, firstName: 1, lastName: 1, avatar: 1 }
    );

    const io = getIO();

    const { masterId: something, id, ...appointmentData } = this;

    const appointment = { ...appointmentData, _id: id, user, isSocket: true };

    io.emit(stringCustomerId, {
      type: CHANGE_APPOINTMENT_STATUS_SOCKET,
      payload: { appointment, user: 'customer', nextStatus },
    });

    return this;
  }
}

module.exports = ChangeStatusByMaster;
