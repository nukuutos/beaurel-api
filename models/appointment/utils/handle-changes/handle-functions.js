// to unsuitable by ...
const byExceptions = require("./to-unsuitable/by-exceptions");
const byManuallyAppointments = require("./to-unsuitable/by-manually-appointments");
const byPossibleTime = require("./to-unsuitable/by-possible-time");
const bySessionTime = require("./to-unsuitable/by-session-time");
const byWeekends = require("./to-unsuitable/by-weekends");

const handleSessionTimeChange = (defaultParams, sessionTime) => {
  bySessionTime(defaultParams, sessionTime);
};

const handleSwitchTypeToAuto = (defaultParams, sessionTime, auto) => {
  const { possibleAppointmentsTime, weekends, exceptions } = auto;

  byPossibleTime(defaultParams, possibleAppointmentsTime, sessionTime);
  byWeekends(defaultParams, weekends);
  byExceptions(defaultParams, exceptions);
};

const handleChangesInAutoTimetable = (defaultParams, sessionTime, changes, auto) => {
  const { possibleAppointmentsTime, weekends, exceptions } = auto;

  if (changes["workingDay"]) {
    byPossibleTime(defaultParams, possibleAppointmentsTime, sessionTime);
  }

  if (changes["weekends"]) byWeekends(defaultParams, weekends);

  if (changes["exceptions"]) byExceptions(defaultParams, exceptions);
};

const handleChangesInManuallyTimetable = (defaultParams, manually) => {
  const { appointments } = manually;
  byManuallyAppointments(defaultParams, appointments);
};

module.exports = {
  handleSessionTimeChange,
  handleSwitchTypeToAuto,
  handleChangesInAutoTimetable,
  handleChangesInManuallyTimetable,
};
