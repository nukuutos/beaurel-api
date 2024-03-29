const dayjs = require('dayjs');
const { APPOINTMENT } = require('../../../../config/collection-names');
const {
  INCORRECT_DURATION,
  INCORRECT_STATUS,
  INVALID_APPOINTMENT,
} = require('../../../../config/errors/appointment');
const { CHANGE_APPOINTMENT_STATUS_SOCKET } = require('../../../../config/socket-io/types');
const User = require('../../../../models/user');
const HttpError = require('../../../../models/utils/http-error');
const unsuitableAppointmentData = require('../../../../pipelines/appointments/unsuitable-appointment-data');
const { getIO } = require('../../../../utils/socket');
const Booking = require('./booking-controllers/booking');

const { IS_SOCKET_IO } = process.env;

class UpdateUnsuitableAppointment extends Booking {
  static name = APPOINTMENT;

  constructor({ masterId, timetable, duration, appointment, date, time, bookedAppointments }) {
    super();

    this.masterId = masterId;
    this.timetable = timetable;
    this.duration = duration;
    this.appointment = appointment;
    this.date = date;
    this.time = time;
    this.bookedAppointments = bookedAppointments;
    this.createdAt = dayjs().toDate();
  }

  static async getData(masterId, appointmentId, date) {
    const pipeline = unsuitableAppointmentData({ masterId, appointmentId, date });
    const data = await this.aggregate(pipeline).next();
    if (!data.appointment) throw new HttpError(INVALID_APPOINTMENT, 404);
    return data;
  }

  checkDuration() {
    const { time, duration, timetable } = this;
    const { endAt, startAt } = time;

    const { sessionTime } = timetable;

    const isStartAndEndCorrect = endAt - startAt === duration;
    const isDurationCorrect = duration % sessionTime === 0;

    if (!isStartAndEndCorrect || !isDurationCorrect) {
      throw new HttpError(INCORRECT_DURATION, 400);
    }

    return this;
  }

  checkStatus() {
    const { status } = this.appointment;

    if (status !== 'unsuitable') {
      throw new HttpError(INCORRECT_STATUS, 400);
    }

    return this;
  }

  setIsViewed() {
    this.isViewed = { master: true, customer: false };
    return this;
  }

  async update(timezone) {
    const { appointment, masterId, duration, date, time, isViewed } = this;

    const recordDate = dayjs().utc().toDate();
    const historyRecord = { user: 'master', status: 'confirmed', date: recordDate };

    const formattedDate = date.toLocalTimeInUTC(timezone);

    await UpdateUnsuitableAppointment.updateOne(
      { _id: appointment._id, masterId },
      {
        $set: {
          'service.duration': duration,
          date: formattedDate.toDate(),
          isViewed,
          time,
          status: 'confirmed',
        },
        $push: { history: historyRecord },
      }
    );
  }

  async sendUpdatedAppointmentToClient() {
    if (!IS_SOCKET_IO) return this;

    const { appointment } = this;
    const { customerId, masterId } = appointment;

    const stringMasterId = masterId.toString();
    const stringCustomerId = customerId.toString();

    if (stringMasterId === stringCustomerId) return this;

    const user = await User.findOne(
      { _id: masterId },
      { role: 1, username: 1, firstName: 1, lastName: 1, isAvatar: 1 }
    );

    const io = getIO();

    const status = { status: 'unsuitable', user: 'master' };

    appointment.date = dayjs(appointment.date).add(1, 'day');

    const appointmentToClient = { ...appointment, status, user, isSocket: true };

    io.emit(stringCustomerId, {
      type: CHANGE_APPOINTMENT_STATUS_SOCKET,
      payload: { appointment: appointmentToClient, user: 'customer', nextStatus: 'confirmed' },
    });

    return this;
  }
}

module.exports = UpdateUnsuitableAppointment;
