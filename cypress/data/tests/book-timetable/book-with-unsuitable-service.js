const cloneDeep = require('lodash.clonedeep');
const Service = require('../../../../models/service');
const Timetable = require('../../../../models/timetable');
const User = require('../../../../models/user');
const master = require('../../masters/master');
const unsuitableService = require('../../services/unsuitable-service');
const autoTimetableWithUpdate = require('../../timetables/auto-timetable-with-update');

const timetable = cloneDeep(autoTimetableWithUpdate);
const service = unsuitableService;

const addDataForBookWithUnsuitableService = async () => {
  timetable.update.date = service.update.date;
  timetable.auto.weekends = [];

  await Timetable.save(timetable);
  await Service.save(service);
  await User.save(master);
  return null;
};

module.exports = addDataForBookWithUnsuitableService;
