const { INCORRECT_EXCEPTIONS } = require('../../../config/errors/timetable');
const HttpError = require('../../utils/http-error');
const TimetableGenerator = require('./timetable-generator');

class AutoGenerator extends TimetableGenerator {
  constructor({ sessionTime, auto, manually, type, timetableId, difference, masterId }) {
    super({ difference, masterId });

    this.timetableId = timetableId;
    this.sessionTime = sessionTime;
    this.auto = auto;
    this.manually = manually;
    this.type = type;
  }

  getPossibleAppointmentsTime() {
    const { sessionTime, auto } = this;
    const { startAt, endAt } = auto.workingDay;

    const possibleAppointmentsTime = [];
    const lastAppointmentStartAt = endAt - sessionTime;

    for (let i = startAt; i <= lastAppointmentStartAt; i += sessionTime) {
      possibleAppointmentsTime.push(i);
    }

    this.auto.possibleAppointmentsTime = possibleAppointmentsTime;

    return this;
  }

  checkExceptions() {
    const { sessionTime, auto } = this;
    const { exceptions, workingDay } = auto;
    const { startAt } = workingDay;

    const days = Object.values(exceptions);

    const isExceptionsCorrect = days.every((day) =>
      day.every((exception) => (exception - startAt) % sessionTime === 0)
    );

    if (!isExceptionsCorrect) throw new HttpError(INCORRECT_EXCEPTIONS, 400);

    return this;
  }
}

module.exports = AutoGenerator;
