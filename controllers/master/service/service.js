const Service = require("../../../models/master/service/service");
const Timetable = require("../../../models/master/timetable/timetable");
const HttpError = require("../../../models/http-error");

const asyncHandler = require("../../../middleware/async-handler");

const { getCorrectSessionTime } = require("./utils");
const isEqual = require("lodash.isequal");
const { ObjectId } = require("mongodb");

exports.getServices = asyncHandler(async (req, res, next) => {
  // delete/get rid of timetable from request(aggregation)
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
  const { id: masterId } = req.user;
  let { service, date } = req.body;

  const { isTitle, servicesCount } = await Service.getServiceCounterAndIsTitleExists(masterId, service.title);

  if (isTitle) return next(new HttpError("You already have service with this title"));

  const timetable = await Timetable.findOne({ masterId }, { _id: 0, sessionTime: 1, update: 1 }); // to get service counter and is tit exists?
  const { sessionTime } = timetable;
  // const sessionTime = getCorrectSessionTime(timetable, date); // for updates in session time
  // if (!sessionTime) return next(new HttpError('Incorrect session time'));

  const { title, duration, price } = service;
  if (duration % sessionTime !== 0) return next(new HttpError("Incorrect duration"));

  service = new Service(masterId, title, duration, price, servicesCount || 0);
  const { insertedId } = await service.save();
  // can i do id instead of ids here?
  return res.json({ id: insertedId, message: "Service is added!", type: "success" });
});

// server get service with order
// server find service with that order
// if order same - alrigth
// else inc all and insert

exports.updateService = asyncHandler(async (req, res, next) => {
  const { serviceId } = req.params;
  const { id: masterId } = req.user;
  const { date, service } = req.body;
  const { title } = service;

  // if (date.getTime() < new Date().getTime()) return next(new HttpError('Invalid date', 400));
  // const { timetable, currentService } = await Service.getServiceAndTimetable(serviceId, masterId);

  // check title
  // if it is service parameter of service (not sub service)
  const isTitle = await Service.findOne({ _id: { $ne: serviceId }, masterId, title }, { _id: 1 });
  if (isTitle) return next(new HttpError("You already have service with this title"));
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
  if (!sessionTime) return next(new HttpError("Incorrect session time"));

  if (duration % sessionTime !== 0) return next(new HttpError("Duration is incorrect", 400));

  await Service.updateOne({ _id: serviceId }, { ...service });

  return res.json({ message: "Service is updated", type: "success" });
});

exports.deleteService = asyncHandler(async (req, res, next) => {
  const { serviceId } = req.params;
  const { id: masterId } = req.user;

  await Service.deleteOne({ _id: serviceId, masterId });

  return res.json({ message: "Service is deleted", type: "success" });
});

exports.updateServicesOrder = asyncHandler(async (req, res, next) => {
  const { newOrder } = req.body;
  const { id: masterId } = req.user;

  await Service.updateOrder(newOrder, masterId);

  res.json({ message: "Service's order is updated", type: "success" });
});

exports.getUnsuitableServices = asyncHandler(async (req, res, next) => {
  const { id: masterId } = req.user;

  const unsuitableServices = await Service.getUnsuitableServices(masterId);

  res.json({ unsuitableServices });
});

exports.putUpdateToServices = asyncHandler(async (req, res, next) => {
  const { services } = req.body; // [{id, duration}]
  const { id: masterId } = req.user;

  // get session time
  // get services' id that are unsuitable
  const { sessionTime, services: servicesIds } = await Service.getDataForUpdate(masterId);

  if (!sessionTime) return next(new HttpError("No updated session time"));

  // check amount of services from client and bd
  if (services.length !== servicesIds.length) return next(new HttpError("Incorrect services to update"));

  // compare ids that we received from bd
  const idsFromClient = services.map(({ id }) => String(id));
  const areIdsEqual = isEqual(idsFromClient.sort(), servicesIds.sort());

  console.log(idsFromClient.sort(), servicesIds.sort(), services);

  if (!areIdsEqual) return next(new HttpError("Incorrect services' duration"));

  // check duration by session time
  if (!services.every(({ duration }) => duration % sessionTime === 0)) {
    return next(new HttpError("Incorrect services' duration"));
  }

  // object id in validator
  await Service.putUpdateToServices(services.map(({ id, duration }) => ({ id, duration })));

  res.json({ message: "Services are updated!", type: "success" });
});
