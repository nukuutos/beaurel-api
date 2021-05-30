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

const getDifference = (obj1, obj2) => {
  const differences = {};

  for (let key in obj1) {
    const areKeysEqual = isEqual(obj1[key], obj2[key]);
    if (!areKeysEqual) differences[key] = 1;
  }

  return differences;
};

exports.compareTimetables = (currentTimetable, updatedTimetable) => {
  const { sessionTime: currentSessionTime, type: currentType } = currentTimetable;
  const { sessionTime: updatedSessionTime, type: updatedType } = updatedTimetable;

  let differences = {};

  if (currentSessionTime !== updatedSessionTime) differences['sessionTime'] = 1;

  if (currentType === updatedType) {
    return { ...differences, ...getDifference(currentTimetable[currentType], updatedTimetable[updatedType]) };
  }

  differences['type'] = 1;

  return differences;
};
