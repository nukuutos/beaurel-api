const cloneDeep = require('lodash.clonedeep');
const Service = require('../../../../models/service');
const Timetable = require('../../../../models/timetable');
const User = require('../../../../models/user');
const master = require('../../masters/master');
const suitableService = require('../../services/suitable-service');
const autoTimetableWithUpdate = require('../../timetables/auto-timetable-with-update');

const timetable = cloneDeep(autoTimetableWithUpdate);
const service = suitableService;

const addDataForBookWithUpdatedService = async () => {
  timetable.auto.weekends = [];
  timetable.update.date = suitableService.update.date;

  await Timetable.save(timetable);
  await Service.save(service);
  await User.save(master);
  return null;
};

module.exports = addDataForBookWithUpdatedService;
