const lodash = require('lodash');
const { UPDATE_EXISTS, SAME_TIMETABLES } = require('../../../../../config/errors/timetable');
const {
  CHANGE_APPOINTMENT_STATUS_SOCKET,
  UPDATE_APPOINTMENT_TO_UNSUITABLE_SOCKET,
} = require('../../../../../config/socket-io/types');
const Appointment = require('../../../../../models/appointment');
const Timetable = require('../../../../../models/timetable');
const User = require('../../../../../models/user');
const HttpError = require('../../../../../models/utils/http-error');
const { getIO } = require('../../../../../utils/socket');

const { IS_SOCKET_IO } = process.env;

class TimetableGenerator extends Timetable {
  constructor({
    masterId,
    sessionTime,
    type,
    auto,
    manually,
    update = null,
    difference = null,
    timezone = null,
  }) {
    super(masterId, sessionTime, type, auto, manually, timezone);
    this.update = update;
    this.difference = difference;
  }

  isUpdate() {
    if (this.update) throw new HttpError(UPDATE_EXISTS, 400);
    return this;
  }

  addUpdate(update) {
    this.update = update;
    return this;
  }

  getDifference(currentTimetable) {
    const { sessionTime: updatedSessionTime, type: updatedType } = this;
    const { sessionTime: currentSessionTime, type: currentType } = currentTimetable;

    let difference = {};

    if (currentSessionTime !== updatedSessionTime) difference.sessionTime = 1;

    if (currentType === updatedType) {
      const subDifference = lodash.getDifference(this[updatedType], currentTimetable[currentType]);
      difference = { ...difference, ...subDifference };
    } else {
      difference.type = 1;
    }

    this.difference = difference;

    return this;
  }

  checkDifference() {
    const differenceNum = Object.keys(this.difference).length;

    if (!differenceNum) {
      throw new HttpError(SAME_TIMETABLES, 400);
    }

    return this;
  }

  async makeUpdate(date) {
    const { timetableId, masterId, difference, timezone, update, ...updateData } = this;

    await Timetable.updateOne(
      { _id: timetableId, masterId },
      { update: { ...updateData, date: date.toDate() } }
    );
  }

  async save() {
    const { timetableId, difference, update, ...timetable } = this;

    return await Timetable.save(timetable);
  }

  async sendUnsuitableAppointmentsToClients() {
    if (!IS_SOCKET_IO) return this;

    const { masterId } = this;

    const appointments = await Appointment.find(
      { masterId, status: 'unsuitable' },
      { masterId: 0 }
    );

    if (!appointments?.length) return this;

    const io = getIO();

    const master = await User.findOne(
      { _id: masterId },
      { role: 1, username: 1, firstName: 1, lastName: 1, avatar: 1 }
    );

    for (const appointment of appointments) {
      const { customerId } = appointment;

      const stringMasterId = masterId.toString();
      const stringCustomerId = customerId.toString();

      if (stringMasterId === stringCustomerId) continue;

      const appointmentToClient = { ...appointment, user: master, isSocket: true };

      console.log(appointmentToClient);

      io.emit(stringCustomerId, {
        type: UPDATE_APPOINTMENT_TO_UNSUITABLE_SOCKET,
        payload: { appointment: appointmentToClient },
      });
    }

    return this;
  }
}

module.exports = TimetableGenerator;
