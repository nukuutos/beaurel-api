const isEqual = require('lodash.isequal');

const Service = require('../models/service');
const Timetable = require('../models/timetable');
const HttpError = require('../models/http-error');

const asyncHandler = require('../middleware/async-handler');

const { getCorrectSessionTime } = require('./utils/service');

exports.getServices = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;

  let { services, timetable } = await Service.getServicesAndTimetable(masterId);
  // indexes or good sort algo, okay?
  // sort subServices
  services = services.map((service) => {
    if (!service.subServices) return service;
    service.subServices.sort((a, b) => a.subOrder - b.subOrder);
    return service;
  });

  // sort services
  services = services.sort((a, b) => a.order - b.order);

  return res.json({ services, timetable });
});

exports.addService = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;
  let { service, date } = req.body;

  const { isTitle, servicesCount } = await Service.getServiceCounterAndIsTitleExists(masterId, service.title);

  if (isTitle) return next(new HttpError('You already have service with this title'));

  const timetable = await Timetable.findOne({ masterId }, { _id: 0, sessionTime: 1, update: 1 }); // to get service counter and is tit exists?

  const sessionTime = getCorrectSessionTime(timetable, date); // for updates in session time
  if (!sessionTime) return next(new HttpError('Incorrect session time'));

  const { title, duration, price } = service;
  if (duration % sessionTime !== 0) return next(new HttpError('Incorrect duration'));

  service = new Service(masterId, title, duration, price, servicesCount || 0);
  const { insertedId } = await service.save();
  // can i do id instead of ids here?
  return res.json({ id: insertedId, message: 'Service is added!', type: 'success' });
});

// server get service with order
// server find service with that order
// if order same - alrigth
// else inc all and insert

exports.updateService = asyncHandler(async (req, res, next) => {
  const { masterId, serviceId } = req.params;
  const { date, service } = req.body;
  const { title } = service;

  // if (date.getTime() < new Date().getTime()) return next(new HttpError('Invalid date', 400));
  // const { timetable, currentService } = await Service.getServiceAndTimetable(serviceId, masterId);

  // check title
  // if it is service parameter of service (not sub service)
  const isTitle = await Service.findOne({ _id: { $ne: serviceId }, masterId, title }, { _id: 1 });
  if (isTitle) return next(new HttpError('You already have service with this title'));
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
  const { duration } = service;

  const timetable = await Timetable.findOne({ masterId }, { _id: 0, sessionTime: 1, update: 1 });
  // Get timetable: current or updated sessionTime
  const sessionTime = getCorrectSessionTime(timetable, date);
  if (!sessionTime) return next(new HttpError('Incorrect session time'));

  if (duration % sessionTime !== 0) return next(new HttpError('Duration is incorrect', 400));

  await Service.updateOne({ _id: serviceId }, { ...service });

  return res.json({ message: 'Service is updated', type: 'success' });
});

exports.deleteService = asyncHandler(async (req, res, next) => {
  const { serviceId } = req.params;

  await Service.deleteOne({ _id: serviceId });

  return res.json({ message: 'Service is deleted', type: 'success' });
});

exports.updateServicesOrder = asyncHandler(async (req, res, next) => {
  const { newOrder } = req.body;
  await Service.updateOrder(newOrder);
  res.json({ message: "Service's order is updated", type: 'success' });
});
