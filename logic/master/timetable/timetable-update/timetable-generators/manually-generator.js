const { INCORRECT_APPOINTMENTS } = require('../../../../../config/errors/timetable');
const HttpError = require('../../../../../models/utils/http-error');
const TimetableGenerator = require('./timetable-generator');

class ManuallyGenerator extends TimetableGenerator {
  constructor({
    sessionTime,
    auto,
    manually,
    type,
    timetableId,
    difference,
    masterId,
    timezone = null,
  }) {
    super({ difference, masterId });

    this.timetableId = timetableId;
    this.sessionTime = sessionTime;
    this.auto = auto;
    this.manually = manually;
    this.type = type;
    this.timezone = timezone;
  }

  checkAppointments() {
    const { manually, sessionTime } = this;
    const { appointments } = manually;

    const days = Object.values(appointments);

    const areAppointmentsCorrect = days.every((day) =>
      day.every((current, i) => {
        const next = day[i + 1];
        const prev = day[i - 1];

        if (prev && prev + sessionTime > current) return false;
        if (next && current + sessionTime > next) return false;

        return true;
      })
    );

    if (!areAppointmentsCorrect) throw new HttpError(INCORRECT_APPOINTMENTS, 400);
  }
}

module.exports = ManuallyGenerator;
