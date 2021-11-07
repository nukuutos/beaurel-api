const {
  getTimetableAndAppointmentsForUpdate,
} = require('../../pipelines/timetable/timetable-and-appointments-update');
const timetableAndAppointments = require('../../pipelines/timetable/timetable-and-appointments');
const Collection = require('../utils/collection/collection');
const { TIMETABLE } = require('../../config/collection-names');
const { TIMETABLE_AND_APPOINTMENTS } = require('../../config/cache');
const { NO_TIMETABLE } = require('../../config/errors/timetable');
const HttpError = require('../utils/http-error');

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

  static async getDataForUpdate(timetableId, masterId) {
    const find = { _id: timetableId, masterId };
    const projection = { _id: 0, masterId: 0 };

    const data = await Timetable.findOne(find, projection);

    if (!data) throw new HttpError(NO_TIMETABLE, 404);

    return data;
  }

  static async getTimetableAndAppointments(masterId) {
    const pipeline = timetableAndAppointments(masterId);
    const data = await this.aggregate(pipeline).cache(masterId, TIMETABLE_AND_APPOINTMENTS).next();

    if (!data) throw new HttpError(NO_TIMETABLE, 404);

    return data;
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
