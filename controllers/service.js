const isEqual = require('lodash.isequal');

const Service = require('../models/service');
const Timetable = require('../models/timetable');
const HttpError = require('../models/http-error');

const asyncHandler = require('../middleware/async-handler');

const { getCorrectSessionTime } = require('./utils/service');

exports.addService = asyncHandler(async (req, res, next) => {
  const masterId = req.user.id;
  const { title, duration, price, parameter, date } = req.body;

  // Get master's session time
  const timetable = await Timetable.findByMasterId(masterId, { _id: 0, sessionTime: 1 });

  // if(date && date !== timetable.update.date)
  const sessionTime = getCorrectSessionTime(timetable, date);
  if (!sessionTime) return next(new HttpError('Incorrect session time'));

  // Check for correction service duration
  if (duration % sessionTime !== 0) return next(new HttpError('Incorrect duration'));

  // Save service
  const service = new Service(masterId, title, duration, price, parameter);
  await service.save();

  return res.json({ message: 'Service is added' });
});

exports.updateService = asyncHandler(async (req, res, next) => {
  const masterId = req.user.id;
  const { serviceId } = req.params;
  const { duration, date, ...rest } = req.body;

  if (date.getTime() < new Date().getTime()) return next(new HttpError('Invalid date', 400));

  const { timetable, currentService } = await Service.getServiceAndTimetable(serviceId, masterId);

  // Get timetable: current or updated sessionTime
  const sessionTime = getCorrectSessionTime(timetable, date);
  if (!sessionTime) return next(new HttpError('Incorrect session time'));
  // Check has service unsuitable date or not
  // if (unsuitableDate && new Date(unsuitableDate).getTime() !== date.getTime())
  //   return next(new HttpError('Service has unsuitable field that you need to update'));

  // Check if service has an update
  // if (serviceUpdate) return next(new HttpError('Service has updated', 400));

  // Check if duration is correct by master's session time
  if (duration % sessionTime !== 0) return next(new HttpError('Duration is incorrect', 400));

  const updatedService = { ...rest, duration };

  // Check if current and update service are the same
  if (isEqual(currentService, updatedService)) {
    return next(new HttpError('Current service and update are equals', 400));
  }

  // Update service
  await Service.updateService(serviceId, masterId, updatedService);

  return res.json({ message: 'Service is updated' });
});

exports.deleteService = asyncHandler(async (req, res, next) => {
  const masterId = req.user.id;
  const { serviceId } = req.params; // hrer destructure obj ike array

  await Service.deleteService(serviceId, masterId);
  return res.json({ message: 'Service is deleted' });
});
