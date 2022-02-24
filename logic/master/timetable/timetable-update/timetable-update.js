const { NO_TIMETABLE } = require('../../../../config/errors/timetable');
const Appointment = require('../../../../models/appointment');
const Service = require('../../../../models/service');
const Timetable = require('../../../../models/timetable');
const HttpError = require('../../../../models/utils/http-error');
const handleChanges = require('./handle-changes');

class TimetableUpdate extends Timetable {
  static async getData(timetableId, masterId) {
    const find = { _id: timetableId, masterId };
    const projection = { _id: 0, masterId: 0 };

    const data = await Timetable.findOne(find, projection);

    if (!data) throw new HttpError(NO_TIMETABLE, 404);

    return data;
  }

  static async toUnsuitable(defaultParams, updatedTimetable, dateTz) {
    await this.appointmentsToUnsuitable({ ...defaultParams, updatedTimetable });

    const unsuitableServices = await this.servicesToUnsuitable({
      ...defaultParams,
      date: dateTz.toDate(),
      sessionTime: updatedTimetable.sessionTime,
    });

    return { unsuitableServices };
  }

  static async appointmentsToUnsuitable({ masterId, date, updatedTimetable, changes }) {
    const bulkOp = Appointment.unorderedBulkOp();
    const defaultParams = { bulkOp, masterId, date };
    handleChanges(defaultParams, changes, updatedTimetable);
    await bulkOp.execute();
  }

  static async servicesToUnsuitable({ masterId, sessionTime, date, changes }) {
    if (!changes.sessionTime) return 0;

    const { modifiedCount } = await Service.updateMany(
      { masterId, duration: { $not: { $mod: [sessionTime, 0] } } },
      { update: { date, status: 'unsuitable' } }
    );

    return modifiedCount;
  }

  static async update() {
    await Timetable.updateMany({ 'update.date': { $lte: new Date() } }, [
      {
        $set: {
          sessionTime: '$update.sessionTime',
          auto: '$update.auto',
          manually: '$update.manually',
          type: '$update.type',
          update: null,
        },
      },
    ]);
  }
}

module.exports = TimetableUpdate;
