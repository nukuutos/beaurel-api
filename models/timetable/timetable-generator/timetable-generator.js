const Timetable = require("../timetable");
const HttpError = require("../../utils/http-error");
const lodash = require("lodash");
const {
  SAME_TIMETABLES,
  UPDATE_EXISTS,
  NO_TIMETABLE,
} = require("../../../config/errors/timetable");

class TimetableGenerator extends Timetable {
  constructor({ masterId, sessionTime, type, auto, manually, update, difference = null }) {
    super(masterId, sessionTime, type, auto, manually);
    this.update = update;
    this.difference = difference;
  }

  isExisted() {
    if (!this.sessionTime) throw new HttpError(NO_TIMETABLE, 404);
    return this;
  }

  isUpdate() {
    if (this.update) throw new HttpError(UPDATE_EXISTS, 400);
    return this;
  }

  addUpdate(update) {
    this.update = update;
    return this;
  }

  getDifference() {
    const { sessionTime: currentSessionTime, type: currentType } = this;
    const { sessionTime: updatedSessionTime, type: updatedType } = this.update;

    let difference = {};

    if (currentSessionTime !== updatedSessionTime) difference["sessionTime"] = 1;

    if (currentType === updatedType) {
      const subDifference = lodash.getDifference(this[currentType], this.update[updatedType]);
      difference = { ...difference, ...subDifference };
    } else {
      difference["type"] = 1;
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
    await Timetable.updateOne({ _id: timetableId, masterId }, { update: { ...update, date } });
  }
}

module.exports = TimetableGenerator;
