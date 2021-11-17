const { NO_UPDATE } = require('../../../config/errors/timetable');
const Appointment = require('../../../models/appointment');
const Service = require('../../../models/service');
const Timetable = require('../../../models/timetable');
const HttpError = require('../../../models/utils/http-error');

class DeleteTimetableUpdate {
  constructor(timetable) {
    this.timetable = timetable;
  }

  static async getTimetable(masterId, timetableId) {
    const timetable = await Timetable.findOne(
      { _id: timetableId, masterId },
      { _id: 0, update: 1 }
    );

    return new this(timetable || {});
  }

  static async deleteUpdate(masterId, timetableId) {
    await this.appointmentsToOnConfirmation(masterId);
    await this.deleteServicesUpdate(masterId);
    await this.deleteTimetableUpdate(timetableId);
  }

  static async appointmentsToOnConfirmation(masterId) {
    await Appointment.updateMany({ masterId, status: 'unsuitable' }, { status: 'onConfirmation' });
  }

  static async deleteServicesUpdate(masterId) {
    await Service.updateMany({ masterId, update: { $exists: true, $ne: null } }, { update: null });
  }

  static async deleteTimetableUpdate(timetableId) {
    await Timetable.updateOne({ _id: timetableId }, { update: null });
  }

  checkExistence() {
    if (!this.timetable.update) throw new HttpError(NO_UPDATE, 404);
  }
}

module.exports = DeleteTimetableUpdate;
