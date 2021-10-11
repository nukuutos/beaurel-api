const timetable = {
  _id,
  masterId,
  sessionTime: [30, 60, 90, 120],
  type: ["auto", "manually"],
  auto: {
    workingDay: { startAt: "0-1440", endAt: "0-1440" },
    weekends: ["0-6"],
    possibleAppointmentsTime: ["0-1440"],
    exceptions: {
      "0": ["0-1440"],
      "1": ["0-1440"],
      "2": ["0-1440"],
      "3": ["0-1440"],
      "4": ["0-1440"],
      "5": ["0-1440"],
      "6": ["0-1440"],
    },
  },
  manually: {
    appointments: {
      "0": ["0-1440"],
      "1": ["0-1440"],
      "2": ["0-1440"],
      "3": ["0-1440"],
      "4": ["0-1440"],
      "5": ["0-1440"],
      "6": ["0-1440"],
    },
  },
  timezone,
  update: null || { sessionTime, type, auto, manually, date: "date in utc" },
};
