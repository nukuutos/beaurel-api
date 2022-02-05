const Collection = require('./utils/collection/collection');
const { TIMETABLE } = require('../config/collection-names');

class Timetable extends Collection {
  static name = TIMETABLE;

  constructor(masterId, sessionTime, type, auto, manually, timezone = null) {
    super();

    this.masterId = masterId;
    this.sessionTime = sessionTime;
    this.type = type;
    this.auto = auto;
    this.manually = manually;
    this.timezone = timezone;
    this.update = null;
  }
}

module.exports = Timetable;
