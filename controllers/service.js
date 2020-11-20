const isEqual = require('lodash.isequal');

const Service = require('../models/service');
const Timetable = require('../models/timetable');
const HttpError = require('../models/http-error');

const asyncHandler = require('../middleware/async-handler');

const { getCorrectSessionTime } = require('./utils/service');

exports.getServices = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const servicesAndTimetable = await Service.getServicesAndTimetable(userId); // without master id
  console.log(servicesAndTimetable);
  return res.json(servicesAndTimetable);
});

exports.addService = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { service, date } = req.body;

  // check title
  const isTitle = await Service.findOne({ masterId: userId, title: service.title }, { _id: 1 });
  if (isTitle) return next(new HttpError('You already have service with this title'));

  // Get master's session time
  const timetable = await Timetable.findOne({ masterId: userId }, { _id: 0, sessionTime: 1, update: 1 });
  const sessionTime = getCorrectSessionTime(timetable, date);
  if (!sessionTime) return next(new HttpError('Incorrect session time'));
  // // Check for correction service duration
  // if (duration % sessionTime !== 0) return next(new HttpError('Incorrect duration'));

  // service with parameters
  let ids;
  if (service.subServices) {
    const { subServices } = service;
    for (let service of subServices) {
      const { duration } = service;
      if (duration % sessionTime !== 0) return next(new HttpError('Incorrect duration'));
    }

    response = await Service.saveServiceParameters(service, userId); // insertedIds object
    ids = response.insertedIds;
  } else {
    // ordinary service
    const { title, duration, price } = service;
    if (duration % sessionTime !== 0) return next(new HttpError('Incorrect duration'));

    const newService = new Service(userId, title, duration, price);
    response = await newService.saveService(); // insertedId value
    ids = response.insertedId;
  }

  return res.json({ ids, message: 'Service is added!', type: 'success' });
});

exports.updateService = asyncHandler(async (req, res, next) => {
  const { userId, serviceId } = req.params;
  const { date, service } = req.body;
  const { title } = service;

  // if (date.getTime() < new Date().getTime()) return next(new HttpError('Invalid date', 400));
  // const { timetable, currentService } = await Service.getServiceAndTimetable(serviceId, masterId);

  // check title
  // if it is service parameter of service (not sub service)
  if (service.title) {
    const isTitle = await Service.findOne({ _id: { $ne: serviceId }, masterId: userId, title }, { _id: 1 });
    if (isTitle) return next(new HttpError('You already have service with this title'));
  }
  // Check has service unsuitable date or not
  // if (unsuitableDate && new Date(unsuitableDate).getTime() !== date.getTime())
  //   return next(new HttpError('Service has unsuitable field that you need to update'));

  // Check if service has an update
  // if (serviceUpdate) return next(new HttpError('Service has updated', 400));

  // Check if duration is correct by master's session time

  // Check if current and update service are the same
  // if (isEqual(currentService, updatedService)) {
  //   return next(new HttpError('Current service and update are equals', 400));
  // }

  // Update service
  // await Service.updateService(serviceId, masterId, updatedService);
  // update service or sub service
  if (typeof serviceId === 'object') {
    const { duration } = service;

    const timetable = await Timetable.findOne({ masterId: userId }, { _id: 0, sessionTime: 1, update: 1 });
    // Get timetable: current or updated sessionTime
    const sessionTime = getCorrectSessionTime(timetable, date);
    if (!sessionTime) return next(new HttpError('Incorrect session time'));

    if (duration % sessionTime !== 0) return next(new HttpError('Duration is incorrect', 400));

    await Service.updateOne({ _id: serviceId }, { ...service });
  } else {
    // update title of subServices
    console.log(userId, serviceId, title);
    await Service.updateMany({ masterId: userId, title: serviceId }, { title });
  }

  // tite, update all services with this title and userId
  // id, update one sub or service

  return res.json({ message: 'Service is updated', type: 'success' });
});

exports.deleteService = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { serviceId } = req.params; // hrer destructure obj ike array

  if (typeof serviceId === 'object') {
    await Service.deleteOne({ _id: serviceId });
  } else {
    await Service.deleteMany({ masterId: userId, title: serviceId });
  }

  return res.json({ message: 'Service is deleted', type: 'success' });
});
