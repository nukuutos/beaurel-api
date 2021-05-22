// get session time of updated timetable or current session time
exports.getCorrectSessionTime = (timetable, date = null) => {
  if (!date) return timetable.sessionTime;

  if (timetable.update && new Date(timetable.update.date).getTime() === date.getTime()) {
    return timetable.update.sessionTime;
  }

  return null;
};

// getSuitableSessionTime;
// getCurrentSessionTime;
// getWorkingSessionTime;
