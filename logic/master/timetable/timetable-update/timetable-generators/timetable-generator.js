const lodash = require('lodash');
const { UPDATE_EXISTS, SAME_TIMETABLES } = require('../../../../../config/errors/timetable');
const Timetable = require('../../../../../models/timetable');
const HttpError = require('../../../../../models/utils/http-error');

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
}

module.exports = TimetableGenerator;
