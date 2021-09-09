const {
  getTimetableAndAppointmentsForUpdate,
} = require("../pipelines/timetable/timetable-and-appointments-update");
const timetableAndAppointments = require("../pipelines/timetable/timetable-and-appointments");
const Collection = require("./utils/collection/collection");
const { TIMETABLE } = require("../config/collection-names");

// sturture
// const timetable = {
//   sessionTime: 60,
//   type: 'auto',
//   auto: {
//     weekends: ['5', '6'],
//     workingDay: {
//       startAt: 600,
//       endAt: 1020,
//     },
//     exceptions: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }, // from 0=mon to 6=sun
//   },
//   manually: {
//     appointments: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }, // from 0=mon to 6=sun
//   },
//   update: {
//     date: null,
//     same what above
// };

class Timetable extends Collection {
  static name = TIMETABLE;

  constructor(
    masterId,
    workingDay,
    sessionTime,
    weekends,
    possibleAppointmentsTime,
    type,
    exceptions,
    appointments
  ) {
    super();

    this.masterId = masterId;

    this.sessionTime = sessionTime;

    this.type = type;

    this.auto = {
      weekends,
      workingDay,
      exceptions, // { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }, from 0=mon to 6=sun
      possibleAppointmentsTime,
    };

    this.manually = {
      appointments, // { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }, from 0=mon to 6=sun
    };

    this.update = null;
  }

  static async getTimetableAndAppointments(masterId) {
    const pipeline = timetableAndAppointments(masterId);
    return await this.aggregate(pipeline).next();
  }

  static async getTimetableAndAppointmentsForUpdate(masterId, appointmentId, date) {
    const pipeline = getTimetableAndAppointmentsForUpdate(masterId, appointmentId, date);
    return await this.aggregate(pipeline).next();
  }
}

module.exports = Timetable;
