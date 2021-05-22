const isEqual = require('lodash.isequal');

exports.generatePossibleAppointmentsTime = (startAt, endAt, sessionTime) => {
  const possibleAppointmentsTime = [];
  const lastAppointmentStartAt = endAt - sessionTime;

  for (let i = startAt; i <= lastAppointmentStartAt; i += sessionTime) {
    possibleAppointmentsTime.push(i);
  }

  return possibleAppointmentsTime;
};

exports.detectTimetableChanges = (currentTimetable, updatedTimetable) => {
  const isWorkingDayChanged =
    currentTimetable.workingDay.startAt < updatedTimetable.workingDay.startAt ||
    currentTimetable.workingDay.endAt > updatedTimetable.workingDay.endAt;

  const isSessionTimeChanged = currentTimetable.sessionTime !== updatedTimetable.sessionTime;
  const isWeekendsChanged = !isEqual(currentTimetable.weekends, updatedTimetable.weekends);

  return { isWorkingDayChanged, isSessionTimeChanged, isWeekendsChanged, isTimetableUpdateChanges: false };
};
