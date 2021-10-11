module.exports = (changes, type) => {
  const isSessionTime = changes["sessionTime"];
  const isSwitchToAuto = type === "auto" && changes["type"];
  const isChangesInAutoTimetable = type === "auto" && !changes["type"];
  const isChangesInManuallyTimetable =
    type === "manually" && (changes["type"] || changes["appointments"]);

  return { isSessionTime, isSwitchToAuto, isChangesInAutoTimetable, isChangesInManuallyTimetable };
};
