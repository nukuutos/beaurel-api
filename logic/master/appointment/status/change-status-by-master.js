const dayjs = require('dayjs');
const {
  UNAVAILABLE_TIME_CONFIRMED_APPOINTMENTS,
} = require('../../../../config/errors/appointment');
const { CHANGE_APPOINTMENT_STATUS_SOCKET } = require('../../../../config/socket-io/types');
const Appointment = require('../../../../models/appointment');
const User = require('../../../../models/user');
const HttpError = require('../../../../models/utils/http-error');
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

  static async confirmationCheck(masterId, appointment) {
    const data = await await Appointment.find(
      { masterId, date: appointment.date, status: 'confirmed' },
      { _id: 0, time: 1 }
    );

    const bookedAppointments = data.map(({ time }) => time);

    const { startAt, endAt } = appointment.time;

    for (let i = 0; i < bookedAppointments.length; i++) {
      const bookedAppointment = bookedAppointments[i];

      // is Current Appointment Before Booked Appointment
      const isBefore = startAt < bookedAppointment.startAt && endAt <= bookedAppointment.startAt;
      // is Current Appointment After Booked Appointment
      const isAfter = startAt >= bookedAppointment.endAt;

      // if current appointment is crossing booked appointment => error
      if (!isBefore && !isAfter) throw new HttpError(UNAVAILABLE_TIME_CONFIRMED_APPOINTMENTS, 400);
    }
  }

  setIsViewed() {
    const { masterId, customerId } = this;

    this.isViewed = { master: true, customer: false };

    if (masterId.toString() === customerId.toString()) {
      this.isViewed.customer = true;
    }

    return this;
  }

  async update(status, masterId, appointment) {
    if (status === 'confirmed') {
      await ChangeStatusByMaster.confirmationCheck(masterId, appointment);
    }

    const { id, isViewed } = this;
    const date = dayjs().utc().toDate();
    const historyRecord = { user: 'master', status, date };

    await Appointment.updateOne(
      { _id: id },
      { $set: { isViewed, status }, $push: { history: historyRecord } }
    );
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
      { role: 1, username: 1, firstName: 1, lastName: 1, isAvatar: 1 }
    );

    const io = getIO();

    const { masterId: something, id, history, status: prevStatus, ...appointmentData } = this;

    const status = { status: prevStatus, user: 'master' };

    appointmentData.date = dayjs(appointmentData.date).add(1, 'day');

    const appointment = { ...appointmentData, _id: id, user, status, isSocket: true };

    io.emit(stringCustomerId, {
      type: CHANGE_APPOINTMENT_STATUS_SOCKET,
      payload: { appointment, user: 'customer', nextStatus },
    });

    return this;
  }
}

module.exports = ChangeStatusByMaster;
