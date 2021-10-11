const {
  getTimetableAndAppointmentsForUpdate,
} = require("../../pipelines/timetable/timetable-and-appointments-update");
const timetableAndAppointments = require("../../pipelines/timetable/timetable-and-appointments");
const Collection = require("../utils/collection/collection");
const { TIMETABLE } = require("../../config/collection-names");

class Timetable extends Collection {
  static name = TIMETABLE;

  constructor(masterId, sessionTime, type, auto, manually) {
    super();

    this.masterId = masterId;
    this.sessionTime = sessionTime;
    this.type = type;
    this.auto = auto;
    this.manually = manually;
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

  static async cancelUpdate(timetableId) {
    await this.updateOne({ _id: timetableId }, { update: null });
  }
}

module.exports = Timetable;
