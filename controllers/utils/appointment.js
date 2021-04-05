exports.getStatuses = (category) => {
  switch (category) {
    case 'history':
      return ['expired', 'ended', 'cancelled', 'rejected'];

    default:
      return [category];
  }
};

exports.getWorkingTimetable = (timetable, date) => {
  const { update, ...currentTimetable } = timetable;

  let workingTimetable = { ...currentTimetable };
  // const updateDate = ;
  // console.log(updateDate);
  if (update && new Date(update.date).getTime() <= date.getTime()) workingTimetable = { ...update };

  return workingTimetable;
};

exports.searchFreeAppointmentsTime = (bookedAppointments, possibleAppointmentsTime, sessionTime) => {
  const freeAppointmentsTime = [...possibleAppointmentsTime];
  const bookedAppointmentsCount = bookedAppointments.length;

  for (let i = 0; i < bookedAppointmentsCount; i++) {
    const bookedTime = bookedAppointments[i];
    const { startAt, endAt } = bookedTime;

    const startIndex = freeAppointmentsTime.indexOf(startAt);
    const deleteCount = (endAt - startAt) / sessionTime;
    freeAppointmentsTime.splice(startIndex, deleteCount);
  }

  return freeAppointmentsTime;
};

exports.getWeekdayIndexRU = (weekdayIndexEN) => {
  const weekdaysCount = 7;

  let weekdayIndexRU = weekdayIndexEN - 1;
  if (weekdayIndexRU < 0) weekdayIndexRU += weekdaysCount; // or just num = 6

  return weekdayIndexRU;
};

exports.isException = (startAtTime, exceptions = []) => {
  exceptions.includes(startAtTime);

  // const dayExceptions = exceptions[weekdayIndexRU];
  // const exceptionsLength = exceptions.length;

  // if (!exceptionsLength) return false;

  // for (let i = 0; i < exceptionsLength; i++) {
  //   const exceptionTime = exceptions[i];
  //   const exceptionIndex = availableAppointments.indexOf(exceptionTime);
  //   availableAppointments.splice(exceptionIndex, 1);
  // }

  // return false;
};
