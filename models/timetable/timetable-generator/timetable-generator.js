const lodash = require('lodash');
const Timetable = require('../timetable');
const HttpError = require('../../utils/http-error');
const { SAME_TIMETABLES, UPDATE_EXISTS } = require('../../../config/errors/timetable');

class TimetableGenerator extends Timetable {
  constructor({ masterId, sessionTime, type, auto, manually, update, difference = null }) {
    super(masterId, sessionTime, type, auto, manually);
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
    const { timetableId, masterId, ...update } = this;

    await Timetable.updateOne(
      { _id: timetableId, masterId },
      { update: { ...update, date: date.toDate() } }
    );
  }
}

module.exports = TimetableGenerator;
